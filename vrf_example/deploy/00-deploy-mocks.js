const { network } = require("hardhat")
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config")

const BASE_FEE = "250000000000000000"
const GAS_PRICE_LINK = 1e9

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()

   if (DEVELOPMENT_CHAINS.includes(network.name)) {
      log("Local network detected! Deploying mocks..")
      await deploy("VRFCoordinatorV2Mock", {
         from: deployer,
         log: true,
         args: [BASE_FEE, GAS_PRICE_LINK]
      })
      log("Mocks Deployed!")
      log("--------------------------------------------------------------")
      log("You are deploying to a local network, you'll need a local network running to interact")
      log("Please run `npx hardhat console --network localhost` to interact with the deployed smart contracts")
      log("--------------------------------------------------------------")
   }
}

module.exports.tags = ["all", "mocks"]