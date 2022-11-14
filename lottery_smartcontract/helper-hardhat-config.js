const { ethers } = require("hardhat");

const networkConfig = {
   default: {
      name: "hardhat",
      keepersUpdateInterval: "30"
   },
   31337: {
      name: "localhost",
      subscriptionId: "6223",
      gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
      keepersUpdateInterval: "30",
      lotteryEntranceFee: ethers.utils.parseEther("0.01"),
      callbackGasLimit: "500000"
   },
   5: {
      name: "goerli",
      subscriptionId: "6223",
      gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
      lotteryEntranceFee: ethers.utils.parseEther("0.01"),
      keepersUpdateInterval: "30",
      callbackGasLimit: "500000",
      vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
   },
   1: {
      name: "mainnet",
      keepersUpdateInterval: "30"
   }
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6

module.exports = {
   networkConfig,
   developmentChains,
   VERIFICATION_BLOCK_CONFIRMATIONS
}