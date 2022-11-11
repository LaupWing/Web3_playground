
const networkConfig = {
   default: {
      name: "hardhat"
   },
   31337: {
      name: "localhost",
      subscriptionId: "",
      gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
      vrfCoordinatorV2: "",
   },
   5: {
      name: "goerli",
      subscriptionId: "",
      gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
      vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D"
   }
}

const DEVELOPMENT_CHAINS = ["hardhat", "localhost"]

const VERIFICATION_BLOCK_CONFIRMATIONS = 6

module.exports = {
   networkConfig,
   DEVELOPMENT_CHAINS,
   VERIFICATION_BLOCK_CONFIRMATIONS
}