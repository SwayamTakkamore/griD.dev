const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying Licensing System to Story Aeneid Testnet...");
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

  console.log("\n" + "=".repeat(50));
  console.log("STEP 1: Deploying RepoNFT");
  console.log("=".repeat(50));
  
  const RepoNFT = await hre.ethers.getContractFactory("RepoNFT");
  const repoNFT = await RepoNFT.deploy("griD Repository", "REPO");
  await repoNFT.waitForDeployment();
  const repoNFTAddress = await repoNFT.getAddress();
  
  console.log("✅ RepoNFT deployed to:", repoNFTAddress);
  console.log("🔗 Explorer:", `https://aeneid.storyscan.io/address/${repoNFTAddress}`);

  console.log("\n" + "=".repeat(50));
  console.log("STEP 2: Deploying LicenseNFT");
  console.log("=".repeat(50));
  
  const LicenseNFT = await hre.ethers.getContractFactory("LicenseNFT");
  const licenseNFT = await LicenseNFT.deploy();
  await licenseNFT.waitForDeployment();
  const licenseNFTAddress = await licenseNFT.getAddress();
  
  console.log("✅ LicenseNFT deployed to:", licenseNFTAddress);
  console.log("🔗 Explorer:", `https://aeneid.storyscan.io/address/${licenseNFTAddress}`);

  console.log("\n" + "=".repeat(50));
  console.log("STEP 3: Deploying LicenseManager");
  console.log("=".repeat(50));
  
  const LicenseManager = await hre.ethers.getContractFactory("LicenseManager");
  const licenseManager = await LicenseManager.deploy(
    licenseNFTAddress,
    deployer.address // platform wallet
  );
  await licenseManager.waitForDeployment();
  const licenseManagerAddress = await licenseManager.getAddress();
  
  console.log("✅ LicenseManager deployed to:", licenseManagerAddress);
  console.log("🔗 Explorer:", `https://aeneid.storyscan.io/address/${licenseManagerAddress}`);

  console.log("\n" + "=".repeat(50));
  console.log("STEP 4: Setting Permissions");
  console.log("=".repeat(50));
  
  // Transfer ownership of LicenseNFT to LicenseManager so it can mint
  console.log("Transferring LicenseNFT ownership to LicenseManager...");
  const tx = await licenseNFT.transferOwnership(licenseManagerAddress);
  await tx.wait();
  console.log("✅ Permissions set");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contracts: {
      RepoNFT: repoNFTAddress,
      LicenseNFT: licenseNFTAddress,
      LicenseManager: licenseManagerAddress
    },
    deployerAddress: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  // Save to deployments folder
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentPath = path.join(deploymentsDir, `licensing-${hre.network.name}.json`);
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log('\n💾 Deployment info saved to:', deploymentPath);

  // Save ABIs for frontend
  const frontendAbiDir = path.join(__dirname, "../../frontend/contracts");
  if (!fs.existsSync(frontendAbiDir)) {
    fs.mkdirSync(frontendAbiDir, { recursive: true });
  }

  // Save RepoNFT ABI
  const repoNFTArtifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../artifacts/contracts/RepoNFT.sol/RepoNFT.json"))
  );
  fs.writeFileSync(
    path.join(frontendAbiDir, "RepoNFT.json"),
    JSON.stringify({ abi: repoNFTArtifact.abi, address: repoNFTAddress }, null, 2)
  );

  // Save LicenseNFT ABI
  const licenseNFTArtifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../artifacts/contracts/LicenseNFT.sol/LicenseNFT.json"))
  );
  fs.writeFileSync(
    path.join(frontendAbiDir, "LicenseNFT.json"),
    JSON.stringify({ abi: licenseNFTArtifact.abi, address: licenseNFTAddress }, null, 2)
  );

  // Save LicenseManager ABI
  const licenseManagerArtifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../artifacts/contracts/LicenseManager.sol/LicenseManager.json"))
  );
  fs.writeFileSync(
    path.join(frontendAbiDir, "LicenseManager.json"),
    JSON.stringify({ abi: licenseManagerArtifact.abi, address: licenseManagerAddress }, null, 2)
  );

  console.log("💾 ABIs saved to frontend/contracts/");

  console.log("\n" + "=".repeat(50));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(50));
  
  console.log("\n📋 Contract Addresses:");
  console.log("REPO_NFT_ADDRESS=" + repoNFTAddress);
  console.log("LICENSE_NFT_ADDRESS=" + licenseNFTAddress);
  console.log("LICENSE_MANAGER_ADDRESS=" + licenseManagerAddress);

  console.log("\n📝 Copy these to your backend/.env file:");
  console.log("-".repeat(50));
  console.log(`REPO_NFT_ADDRESS=${repoNFTAddress}`);
  console.log(`LICENSE_NFT_ADDRESS=${licenseNFTAddress}`);
  console.log(`LICENSE_MANAGER_ADDRESS=${licenseManagerAddress}`);
  console.log("-".repeat(50));

  console.log("\n✨ Next steps:");
  console.log("1. Copy the addresses above to backend/.env");
  console.log("2. Restart your backend server");
  console.log("3. Test creating a repository with licensing");
  console.log("4. Test purchasing a license");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
