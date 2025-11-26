// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./LicenseNFT.sol";

/**
 * @title LicenseManager
 * @notice Manages license templates, pricing, minting, and royalty distribution
 */
contract LicenseManager is Ownable, ReentrancyGuard {
    LicenseNFT public licenseNFT;
    
    struct LicenseTemplate {
        string name;
        string termsUri; // IPFS URI with full license terms
        uint256 priceWei;
        uint256 royaltyBps; // basis points (100 = 1%)
        address payable royaltyRecipient;
        bool isActive;
    }
    
    struct PaymentSplit {
        address payable recipient;
        uint256 bps; // basis points
    }
    
    // repoId => templateId => LicenseTemplate
    mapping(uint256 => mapping(uint256 => LicenseTemplate)) public templates;
    
    // repoId => templateId counter
    mapping(uint256 => uint256) public nextTemplateId;
    
    // repoId => owner
    mapping(uint256 => address) public repoOwners;
    
    // Platform fee in basis points (e.g., 250 = 2.5%)
    uint256 public platformFeeBps = 250;
    address payable public platformWallet;
    
    event TemplateCreated(uint256 indexed repoId, uint256 indexed templateId, string name, uint256 price);
    event LicensePurchased(uint256 indexed licenseId, uint256 indexed repoId, uint256 templateId, address buyer, uint256 price);
    event RoyaltyPaid(uint256 indexed repoId, address recipient, uint256 amount);
    event PlatformFeeUpdated(uint256 newFeeBps);
    
    constructor(address _licenseNFT, address payable _platformWallet) Ownable(msg.sender) {
        licenseNFT = LicenseNFT(_licenseNFT);
        platformWallet = _platformWallet;
    }
    
    /**
     * @notice Register a repository owner (called when repo is created)
     */
    function registerRepo(uint256 repoId, address owner) external onlyOwner {
        require(repoOwners[repoId] == address(0), "Repo already registered");
        repoOwners[repoId] = owner;
    }
    
    /**
     * @notice Create a license template for a repository
     */
    function createTemplate(
        uint256 repoId,
        string calldata name,
        string calldata termsUri,
        uint256 priceWei,
        uint256 royaltyBps,
        address payable royaltyRecipient
    ) external returns (uint256) {
        require(repoOwners[repoId] == msg.sender, "Not repo owner");
        require(royaltyBps <= 10000, "Invalid royalty");
        
        uint256 templateId = nextTemplateId[repoId]++;
        
        templates[repoId][templateId] = LicenseTemplate({
            name: name,
            termsUri: termsUri,
            priceWei: priceWei,
            royaltyBps: royaltyBps,
            royaltyRecipient: royaltyRecipient,
            isActive: true
        });
        
        emit TemplateCreated(repoId, templateId, name, priceWei);
        return templateId;
    }
    
    /**
     * @notice Purchase a license (mints License NFT and distributes payment)
     */
    function purchaseLicense(uint256 repoId, uint256 templateId) external payable nonReentrant returns (uint256) {
        LicenseTemplate memory template = templates[repoId][templateId];
        require(template.isActive, "Template not active");
        require(msg.value >= template.priceWei, "Insufficient payment");
        
        // Mint license NFT
        uint256 licenseId = licenseNFT.mintLicense(msg.sender, repoId, templateId);
        
        // Distribute payment
        _distributePayment(repoId, template);
        
        emit LicensePurchased(licenseId, repoId, templateId, msg.sender, msg.value);
        
        // Refund excess
        if (msg.value > template.priceWei) {
            payable(msg.sender).transfer(msg.value - template.priceWei);
        }
        
        return licenseId;
    }
    
    /**
     * @notice Distribute payment: platform fee + royalty + owner
     */
    function _distributePayment(uint256 repoId, LicenseTemplate memory template) internal {
        uint256 totalAmount = template.priceWei;
        
        // Platform fee
        uint256 platformFee = (totalAmount * platformFeeBps) / 10000;
        if (platformFee > 0) {
            platformWallet.transfer(platformFee);
        }
        
        uint256 remaining = totalAmount - platformFee;
        
        // Royalty split (if any)
        if (template.royaltyBps > 0 && template.royaltyRecipient != address(0)) {
            uint256 royaltyAmount = (remaining * template.royaltyBps) / 10000;
            template.royaltyRecipient.transfer(royaltyAmount);
            emit RoyaltyPaid(repoId, template.royaltyRecipient, royaltyAmount);
            remaining -= royaltyAmount;
        }
        
        // Remaining to repo owner
        address payable owner = payable(repoOwners[repoId]);
        if (remaining > 0 && owner != address(0)) {
            owner.transfer(remaining);
        }
    }
    
    /**
     * @notice Update template status
     */
    function setTemplateActive(uint256 repoId, uint256 templateId, bool active) external {
        require(repoOwners[repoId] == msg.sender, "Not repo owner");
        templates[repoId][templateId].isActive = active;
    }
    
    /**
     * @notice Update platform fee (onlyOwner)
     */
    function setPlatformFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 1000, "Fee too high"); // max 10%
        platformFeeBps = newFeeBps;
        emit PlatformFeeUpdated(newFeeBps);
    }
    
    /**
     * @notice Update platform wallet
     */
    function setPlatformWallet(address payable newWallet) external onlyOwner {
        platformWallet = newWallet;
    }
    
    /**
     * @notice Get template details
     */
    function getTemplate(uint256 repoId, uint256 templateId) external view returns (LicenseTemplate memory) {
        return templates[repoId][templateId];
    }
}
