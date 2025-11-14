# griD Smart Contracts

Solidity smart contracts for griD.dev - A decentralized GitHub built on Story Protocol.

## Contracts

### RepositoryRegistry.sol

Main contract that stores critical repository data on-chain:

- **Repository metadata**: repoId, ipfsCid, owner, storyIpId, timestamp
- **Ownership management**: Transfer ownership, verify ownership
- **Update tracking**: Update IPFS CID on new commits
- **Event emission**: Events for backend indexing

**Key Functions:**
- `createRepository(repoId, ipfsCid, storyIpId)` - Create new repo on-chain
- `updateRepository(repoId, newIpfsCid, newStoryIpId)` - Update after commits
- `transferOwnership(repoId, newOwner)` - Transfer repo to new owner
- `getRepository(repoId)` - Query repo data
- `getRepositoriesByOwner(owner)` - Get all repos by address

## Setup

### Install Dependencies

```bash
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
DEPLOYER_PRIVATE_KEY=0xyour_private_key
STORY_RPC_URL=https://aeneid.storyrpc.io
```

### Get Testnet Tokens

Visit: https://aeneid.faucet.story.foundation

Enter your wallet address to get free IP tokens for deployment.

## Deployment

### Compile Contracts

```bash
npm run compile
```

### Deploy to Story Aeneid Testnet

```bash
npm run deploy
```

This will:
1. Deploy `RepositoryRegistry` to Story Aeneid (Chain ID 1315)
2. Save deployment info to `deployments/aeneid.json`
3. Copy ABI to `../frontend/contracts/RepositoryRegistry.json`
4. Display contract address and explorer link

### Verify Contract (Optional)

```bash
npx hardhat verify --network aeneid CONTRACT_ADDRESS
```

## Testing

### Run Tests

```bash
npm test
```

### Coverage

```bash
npm run coverage
```

## Network Configuration

### Story Aeneid Testnet

- **Chain ID**: 1315 (0x523)
- **RPC URL**: https://aeneid.storyrpc.io
- **Explorer**: https://aeneid.storyscan.io
- **Faucet**: https://aeneid.faucet.story.foundation
- **Currency**: IP (Intellectual Property token)

## Contract Architecture

```solidity
contract RepositoryRegistry {
    struct Repository {
        string repoId;
        string ipfsCid;
        address owner;
        string storyIpId;
        uint256 createdAt;
        bool exists;
    }
    
    mapping(string => Repository) public repositories;
    mapping(address => string[]) public ownerRepositories;
    string[] public allRepoIds;
    
    event RepositoryCreated(repoId, ipfsCid, owner, storyIpId, timestamp);
    event RepositoryUpdated(repoId, newIpfsCid, newStoryIpId, timestamp);
    event OwnershipTransferred(repoId, previousOwner, newOwner, timestamp);
}
```

## Gas Costs (Estimated)

- Deploy: ~0.001 IP
- Create repository: ~0.0002 IP
- Update repository: ~0.0001 IP
- Transfer ownership: ~0.0001 IP

## Security

- ✅ Owner-only functions
- ✅ Existence checks
- ✅ Zero address validation
- ✅ Reentrancy safe (no external calls)
- ✅ No upgradeable pattern (immutable)

## Integration

### Frontend (React/Next.js)

```typescript
import { useRepositoryContract } from '@/hooks/useRepositoryContract';

const { createRepositoryOnChain } = useRepositoryContract();

await createRepositoryOnChain('repo_123', 'QmIPFSHash', 'story_ip_id');
```

### Backend (Node.js)

```javascript
const indexer = require('./services/blockchainIndexer');

await indexer.initialize();
indexer.startListening(); // Auto-indexes to MongoDB
```

## Events

### RepositoryCreated
```
event RepositoryCreated(
    string indexed repoId,
    string ipfsCid,
    address indexed owner,
    string storyIpId,
    uint256 timestamp
);
```

### RepositoryUpdated
```
event RepositoryUpdated(
    string indexed repoId,
    string newIpfsCid,
    string newStoryIpId,
    uint256 timestamp
);
```

### OwnershipTransferred
```
event OwnershipTransferred(
    string indexed repoId,
    address indexed previousOwner,
    address indexed newOwner,
    uint256 timestamp
);
```

## Development

### Local Testing

```bash
npx hardhat node  # Start local node
npm run deploy -- --network localhost
```

### Debugging

```bash
npx hardhat console --network aeneid
```

In console:
```javascript
const Registry = await ethers.getContractFactory("RepositoryRegistry");
const registry = await Registry.attach("0xYourContractAddress");
await registry.getTotalRepositories();
```

## Troubleshooting

### "Insufficient funds"
Get testnet tokens from faucet: https://aeneid.faucet.story.foundation

### "Network not found"
Check `STORY_RPC_URL` in `.env` is `https://aeneid.storyrpc.io`

### "Contract not verified"
Manual verification:
```bash
npx hardhat verify --network aeneid CONTRACT_ADDRESS
```

## Resources

- [Story Protocol Docs](https://docs.story.foundation/)
- [Story Explorer](https://aeneid.storyscan.io/)
- [Hardhat Docs](https://hardhat.org/docs)
- [Solidity Docs](https://docs.soliditylang.org/)

## License

MIT
