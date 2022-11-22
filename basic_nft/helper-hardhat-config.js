const networkConfig = {
   31337: {
      name: "localhost",
      ethUsdPriceFeed: "",
      gasLane: "",
      mintFee: "",
      callbackGasLimit: "",
   },
   5: {
      name: "goerli",
      ethUsdPriceFeed: "",
      vrfCoordinatorV2: "",
      gasLane: "",
      mintFee: "",
      callbackGasLimit: "",
      subscriptionId: "",
   },
}

const DECIMALS = "18"
const INITIAL_PRICE = ""
const developmentChains = ["hardhat", "localhost"]

module.exports = {
   networkConfig,
   developmentChains,
   DECIMALS,
   INITIAL_PRICE,
}
