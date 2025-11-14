# Blockchain Recovery Script

## What is this?

This script rebuilds your MongoDB database from blockchain data. It scans all `RepositoryCreated` events from the RepositoryRegistry smart contract and re-indexes them to MongoDB.

## When to use?

- 🚨 **MongoDB data lost** - Database crashed or corrupted
- 🔄 **Database migration** - Moving to new MongoDB instance
- ✅ **Data verification** - Verify MongoDB matches blockchain
- 🧹 **Clean slate** - Start fresh with blockchain as source of truth

## How it works

```
Blockchain (Source of Truth)  →  Recovery Script  →  MongoDB (Cache)
```

1. Connects to Story Aeneid blockchain
2. Queries all `RepositoryCreated` events
3. Rebuilds MongoDB from events
4. Enriches with IPFS metadata

## Usage

### Basic recovery (from genesis block)
```bash
cd backend
node scripts/recover-from-blockchain.js
```

### Recovery from specific block
```bash
node scripts/recover-from-blockchain.js 1000000
```

## Prerequisites

1. ✅ Contract deployed to Story Aeneid
2. ✅ `REPOSITORY_CONTRACT_ADDRESS` set in `.env`
3. ✅ Contract ABI exists at `frontend/contracts/RepositoryRegistry.json`
4. ✅ MongoDB connection configured

## What gets recovered?

### ✅ From Blockchain (100% reliable)
- Repository ID
- IPFS CID
- Owner address
- Story Protocol IP ID
- Creation timestamp
- Ownership transfers
- Updates/commits

### 📝 From IPFS (best effort)
- Title
- Description
- Tags
- License type
- Metadata

### ❌ Not recoverable (app-specific data)
- Stars count
- Forks count
- User profiles
- Comments/discussions
- Activity feed

## Safety

- **Non-destructive** - Skips existing records
- **Read-only blockchain** - Cannot modify chain
- **Incremental** - Can run multiple times safely
- **Idempotent** - Same result every time

## Example

```bash
$ node scripts/recover-from-blockchain.js

🔄 Starting recovery from blockchain...

📊 Connecting to MongoDB...
✅ MongoDB connected

🔗 Connecting to blockchain...
✅ Blockchain indexer initialized
📝 Contract address: 0x1234...

⚠️  WARNING: This will sync all blockchain data to MongoDB
📍 Starting from block: 0
📝 Existing records will be skipped

📥 Found 42 repository creation events
⏭️  Skipping repo_123 (already indexed)
✅ Synced repo_456
📝 Enriched metadata for repo_456
...
✅ Recovery complete!
```

## Performance

- **Small dataset** (<100 repos): ~30 seconds
- **Medium dataset** (100-1000 repos): ~5 minutes
- **Large dataset** (>1000 repos): ~30+ minutes

## Troubleshooting

### "Contract not initialized"
- Deploy contract first: `cd contracts && npm run deploy`
- Set `REPOSITORY_CONTRACT_ADDRESS` in backend `.env`

### "ABI not found"
- Deploy script automatically copies ABI to frontend
- Or manually copy from `contracts/artifacts/` to `frontend/contracts/`

### "Too many requests"
- RPC rate limiting - add delays between queries
- Use private RPC endpoint

### "MongoDB connection failed"
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB is running

## Architecture Note

This recovery capability is the key difference between centralized and decentralized:

**Centralized app:**
```
Database crashed → Data lost forever ❌
```

**Hybrid app (with blockchain):**
```
Database crashed → Run recovery script → Data restored ✅
```

MongoDB becomes a **rebuildable cache** instead of single source of truth!
