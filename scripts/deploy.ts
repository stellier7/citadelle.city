import { ethers } from "hardhat";

async function main() {
  const [deployer, user1, user2] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy ONCHAINID
  const ONCHAINID = await ethers.getContractFactory("ONCHAINID");
  const onchainId = await ONCHAINID.deploy();
  await onchainId.waitForDeployment();
  console.log("ONCHAINID deployed to:", await onchainId.getAddress());

  // Initialize ONCHAINID
  await onchainId.initialize(deployer.address);
  console.log("ONCHAINID initialized");

  // Deploy IdentityRegistry
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy();
  await identityRegistry.waitForDeployment();
  console.log("IdentityRegistry deployed to:", await identityRegistry.getAddress());

  // Initialize IdentityRegistry
  await identityRegistry.initialize(deployer.address, await onchainId.getAddress());
  console.log("IdentityRegistry initialized");

  // Deploy Compliance
  const Compliance = await ethers.getContractFactory("Compliance");
  const compliance = await Compliance.deploy();
  await compliance.waitForDeployment();
  console.log("Compliance deployed to:", await compliance.getAddress());

  // Initialize Compliance
  await compliance.initialize(deployer.address, await identityRegistry.getAddress());
  console.log("Compliance initialized");

  // Deploy RWAContract
  const RWAContract = await ethers.getContractFactory("RWAContract");
  const rwaContract = await RWAContract.deploy();
  await rwaContract.waitForDeployment();
  console.log("RWAContract deployed to:", await rwaContract.getAddress());

  // Initialize RWAContract
  await rwaContract.initialize(
    "Property Token",
    "PTK",
    deployer.address,
    await compliance.getAddress()
  );
  console.log("RWAContract initialized");

  // Register identities
  await identityRegistry.registerIdentity(user1.address, user1.address);
  await identityRegistry.registerIdentity(user2.address, user2.address);
  console.log("Test identities registered");

  // Submit and verify a test property
  const propertyName = "Test Property";
  const propertyLocation = "Test Location";
  const propertyPrice = ethers.parseEther("100");
  const squareMeters = 100;
  const legalIdentifier = "TEST-001";

  await rwaContract.submitProperty(
    propertyName,
    propertyLocation,
    propertyPrice,
    squareMeters,
    legalIdentifier
  );
  console.log("Test property submitted");

  await rwaContract.verifyProperty(1);
  console.log("Test property verified");

  await rwaContract.tokenizeProperty(1);
  console.log("Test property tokenized");

  // Test staking
  const stakingDuration = 30 * 24 * 60 * 60; // 30 days
  await rwaContract.stakeProperty(1, stakingDuration);
  console.log("Test property staked");

  // Save deployment info
  const deploymentInfo = {
    onchainId: await onchainId.getAddress(),
    identityRegistry: await identityRegistry.getAddress(),
    compliance: await compliance.getAddress(),
    rwaContract: await rwaContract.getAddress(),
    chainId: (await ethers.provider.getNetwork()).chainId,
    timestamp: new Date().toISOString()
  };

  console.log("Deployment info:", deploymentInfo);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
  console.error(error);
    process.exit(1);
}); 