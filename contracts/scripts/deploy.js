const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying RepositoryRegistry to Story Aeneid Testnet...");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "IP");

  if (balance === 0n) {
    console.log("\n⚠️  WARNING: Deployer has 0 balance!");
    console.log("💡 Get testnet IP tokens from: https://aeneid.faucet.story.foundation");
    console.log("📝 Your address:", deployer.address);
    process.exit(1);
  }

  // Deploy contract
  console.log("\n📝 Deploying contract...");
  const RepositoryRegistry = await hre.ethers.getContractFactory("RepositoryRegistry");
  const registry = await RepositoryRegistry.deploy();

  await registry.waitForDeployment();
  const contractAddress = await registry.getAddress();

  console.log("\n✅ RepositoryRegistry deployed to:", contractAddress);
  console.log("🔗 Explorer:", `https://aeneid.storyscan.io/address/${contractAddress}`);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  const fs = require("fs");
  const path = require("path");
  
  // Save to deployments folder
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentPath = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log('\n💾 Deployment info saved to:', deploymentPath);

  // Save ABI for frontend
  const artifactPath = path.join(__dirname, "../artifacts/contracts/RepositoryRegistry.sol/RepositoryRegistry.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  const frontendAbiDir = path.join(__dirname, "../../frontend/contracts");
  if (!fs.existsSync(frontendAbiDir)) {
    fs.mkdirSync(frontendAbiDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(frontendAbiDir, "RepositoryRegistry.json"),
    JSON.stringify({ abi: artifact.abi, address: contractAddress }, null, 2)
  );
  console.log("💾 ABI saved to frontend/contracts/");

  console.log("\n🎉 Deployment complete!");
  console.log("\n📋 Next steps:");
  console.log("1. Update frontend to use contract address:", contractAddress);
  console.log("2. Update backend to listen to contract events");
  console.log("3. Test repository creation on-chain");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
