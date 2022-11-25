const { ethers } = require("hardhat")

const DECIMALS = "18"
const INITIAL_PRICE = ""
const developmentChains = ["hardhat", "localhost"]

const networkConfig = {
   31337: {
      name: "localhost",
      gasLane: "",
      mintFee: ethers.utils.parseEther("0.01"),
      callbackGasLimit: "500000" 
   },
   5: {
      name: "goerli",
      vrfCoordinatorV2: "",
      gasLane: "",
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