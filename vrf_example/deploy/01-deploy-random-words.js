const { network } = require("hardhat")
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config")


module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deployer } = await getNamedAccounts()
   const chainId = network.config.chainId

   if (DEVELOPMENT_CHAINS.includes(network.name)) {

   }
}