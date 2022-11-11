
const networkConfig = {
   default: {
      name: "hardhat"
   },
   31337: {
      name: "localhost",
      subscriptionId: "",
      gasLane: ""
   }
}

const DEVELOPMENT_CHAINS = ["hardhat", "localhost"]

const VERIFICATION_BLOCK_CONFIRMATIONS = 6

module.exports = {
   networkConfig,
   DEVELOPMENT_CHAINS,
   VERIFICATION_BLOCK_CONFIRMATIONS
}