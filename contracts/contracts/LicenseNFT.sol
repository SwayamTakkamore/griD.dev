// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LicenseNFT is ERC721, Ownable {
    uint256 public nextLicenseId;
    mapping(uint256 => uint256) public licenseToRepo; // licenseId -> repoId
    mapping(uint256 => uint256) public licenseTemplate; // license metadata template id

    event LicenseMinted(uint256 licenseId, uint256 repoId, address buyer, uint256 templateId);

    constructor() ERC721("griD License", "GLIC") Ownable(msg.sender) {}

    function mintLicense(address buyer, uint256 repoId, uint256 templateId) external payable returns (uint256) {
        uint256 id = ++nextLicenseId;
        _safeMint(buyer, id);
        licenseToRepo[id] = repoId;
        licenseTemplate[id] = templateId;
        emit LicenseMinted(id, repoId, buyer, templateId);
        return id;
    }
}
