const { ethers } = require("hardhat")

const DECIMALS = "18"
const INITIAL_PRICE = ""
const developmentChains = ["hardhat", "localhost"]

const networkConfig = {
   31337: {
      name: "localhost",
      gasLane: "0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef",
      mintFee: ethers.utils.parseEther("0.01"),
      callbackGasLimit: "500000" 
   },
   5: {
      name: "goerli",
      vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
      gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
      callbackGasLimit: "500000",
      subscriptionId: ""
   }
}

module.exports = {
   developmentChains,
   DECIMALS,
   INITIAL_PRICE,
   networkConfig
}