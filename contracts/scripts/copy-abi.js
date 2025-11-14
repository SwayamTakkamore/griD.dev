const fs = require('fs');
const path = require('path');

// Read full artifact
const artifactPath = path.join(__dirname, '../artifacts/contracts/RepositoryRegistry.sol/RepositoryRegistry.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

// Create frontend contracts directory
const frontendDir = path.join(__dirname, '../../frontend/contracts');
if (!fs.existsSync(frontendDir)) {
  fs.mkdirSync(frontendDir, { recursive: true });
}

// Save ABI with contract address
const output = {
  address: '0x59e4338E9da115A04603D1C11b8BD20F97f4e3B0',
  abi: artifact.abi
};

fs.writeFileSync(
  path.join(frontendDir, 'RepositoryRegistry.json'),
  JSON.stringify(output, null, 2)
);

console.log('✅ ABI saved to frontend/contracts/RepositoryRegistry.json');
console.log('📝 Contract address: 0x59e4338E9da115A04603D1C11b8BD20F97f4e3B0');
