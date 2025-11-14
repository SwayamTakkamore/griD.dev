// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RepositoryRegistry
 * @dev Stores critical repository data on-chain for Story Protocol integration
 * MongoDB acts as cache - this is the source of truth
 */
contract RepositoryRegistry {
    struct Repository {
        string repoId;           // Unique identifier
        string ipfsCid;          // IPFS content identifier
        address owner;           // Repository owner
        string storyIpId;        // Story Protocol IP Asset ID
        uint256 createdAt;       // Creation timestamp
        bool exists;             // Flag to check existence
    }

    // Mapping from repoId to Repository
    mapping(string => Repository) public repositories;
    
    // Mapping from owner address to their repo IDs
    mapping(address => string[]) public ownerRepositories;
    
    // Array of all repo IDs for enumeration
    string[] public allRepoIds;

    // Events for indexing by backend
    event RepositoryCreated(
        string indexed repoId,
        string ipfsCid,
        address indexed owner,
        string storyIpId,
        uint256 timestamp
    );

    event RepositoryUpdated(
        string indexed repoId,
        string newIpfsCid,
        string newStoryIpId,
        uint256 timestamp
    );

    event OwnershipTransferred(
        string indexed repoId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    /**
     * @dev Create a new repository on-chain
     * @param _repoId Unique repository identifier
     * @param _ipfsCid IPFS content identifier
     * @param _storyIpId Story Protocol IP Asset ID (can be empty initially)
     */
    function createRepository(
        string memory _repoId,
        string memory _ipfsCid,
        string memory _storyIpId
    ) external {
        require(!repositories[_repoId].exists, "Repository already exists");
        require(bytes(_repoId).length > 0, "RepoId cannot be empty");
        require(bytes(_ipfsCid).length > 0, "IPFS CID cannot be empty");

        Repository memory newRepo = Repository({
            repoId: _repoId,
            ipfsCid: _ipfsCid,
            owner: msg.sender,
            storyIpId: _storyIpId,
            createdAt: block.timestamp,
            exists: true
        });

        repositories[_repoId] = newRepo;
        ownerRepositories[msg.sender].push(_repoId);
        allRepoIds.push(_repoId);

        emit RepositoryCreated(
            _repoId,
            _ipfsCid,
            msg.sender,
            _storyIpId,
            block.timestamp
        );
    }

    /**
     * @dev Update repository IPFS CID (for new commits)
     * @param _repoId Repository identifier
     * @param _newIpfsCid New IPFS content identifier
     * @param _newStoryIpId Updated Story Protocol IP ID
     */
    function updateRepository(
        string memory _repoId,
        string memory _newIpfsCid,
        string memory _newStoryIpId
    ) external {
        require(repositories[_repoId].exists, "Repository does not exist");
        require(repositories[_repoId].owner == msg.sender, "Not the owner");
        require(bytes(_newIpfsCid).length > 0, "IPFS CID cannot be empty");

        repositories[_repoId].ipfsCid = _newIpfsCid;
        repositories[_repoId].storyIpId = _newStoryIpId;

        emit RepositoryUpdated(
            _repoId,
            _newIpfsCid,
            _newStoryIpId,
            block.timestamp
        );
    }

    /**
     * @dev Transfer repository ownership
     * @param _repoId Repository identifier
     * @param _newOwner New owner address
     */
    function transferOwnership(
        string memory _repoId,
        address _newOwner
    ) external {
        require(repositories[_repoId].exists, "Repository does not exist");
        require(repositories[_repoId].owner == msg.sender, "Not the owner");
        require(_newOwner != address(0), "Invalid new owner");
        require(_newOwner != msg.sender, "Already the owner");

        address previousOwner = repositories[_repoId].owner;
        repositories[_repoId].owner = _newOwner;

        // Update owner mappings
        ownerRepositories[_newOwner].push(_repoId);

        emit OwnershipTransferred(
            _repoId,
            previousOwner,
            _newOwner,
            block.timestamp
        );
    }

    /**
     * @dev Get repository details
     * @param _repoId Repository identifier
     */
    function getRepository(string memory _repoId)
        external
        view
        returns (
            string memory repoId,
            string memory ipfsCid,
            address owner,
            string memory storyIpId,
            uint256 createdAt
        )
    {
        require(repositories[_repoId].exists, "Repository does not exist");
        Repository memory repo = repositories[_repoId];
        return (repo.repoId, repo.ipfsCid, repo.owner, repo.storyIpId, repo.createdAt);
    }

    /**
     * @dev Get repositories owned by an address
     * @param _owner Owner address
     */
    function getRepositoriesByOwner(address _owner)
        external
        view
        returns (string[] memory)
    {
        return ownerRepositories[_owner];
    }

    /**
     * @dev Get total number of repositories
     */
    function getTotalRepositories() external view returns (uint256) {
        return allRepoIds.length;
    }

    /**
     * @dev Check if repository exists
     * @param _repoId Repository identifier
     */
    function repositoryExists(string memory _repoId) external view returns (bool) {
        return repositories[_repoId].exists;
    }

    /**
     * @dev Verify ownership
     * @param _repoId Repository identifier
     * @param _address Address to check
     */
    function isOwner(string memory _repoId, address _address)
        external
        view
        returns (bool)
    {
        return repositories[_repoId].exists && repositories[_repoId].owner == _address;
    }
}
