const hre = require("hardhat");

async function main() {
  console.log("🔍 Checking deployer wallet...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deployer Address:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "IP");
  
  if (balance === 0n) {
    console.log("\n❌ No balance! Get test tokens from:");
    console.log("👉 https://aeneid.faucet.story.foundation");
  } else if (balance < hre.ethers.parseEther("0.05")) {
    console.log("\n⚠️  Low balance! Recommended: at least 0.05 IP for deployment");
    console.log("👉 https://aeneid.faucet.story.foundation");
  } else {
    console.log("\n✅ Sufficient balance for deployment!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
