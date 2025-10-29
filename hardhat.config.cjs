require("dotenv").config(); // Load environment variables from .env
require("@nomicfoundation/hardhat-toolbox"); // Includes ethers, chai matchers, etc.

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    baseSepolia: {
      url: "https://base-sepolia.blockpi.network/v1/rpc/public",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
