// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RepoNFT is ERC721, Ownable {
    uint256 public nextId;
    mapping(uint256 => string) public metadataUri; // points to IPFS metadata with encryptedCid

    event RepositoryRegistered(uint256 indexed repoId, address indexed owner, string metadataUri);

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) Ownable(msg.sender) {}

    function registerRepository(address to, string calldata _metadataUri) external onlyOwner returns (uint256) {
        uint256 id = ++nextId;
        _safeMint(to, id);
        metadataUri[id] = _metadataUri;
        emit RepositoryRegistered(id, to, _metadataUri);
        return id;
    }

    function setMetadataUri(uint256 tokenId, string calldata _uri) external onlyOwner {
        metadataUri[tokenId] = _uri;
    }
}
