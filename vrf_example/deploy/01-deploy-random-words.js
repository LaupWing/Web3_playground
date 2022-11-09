const { network } = require("hardhat")


module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deployer } = await getNamedAccounts()
   const chainId = network.config.chainId
   console.log(network.name)
}