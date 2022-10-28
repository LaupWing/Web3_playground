const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const DECIMALS = "8"
const INITIAL_PRICE = "200000000000"

/** @type import('hardhat/config'). */
module.exports = async ({ getNamedAccounts, deployments }) => {
   const { log, deploy } = deployments
   const { deployer } = await getNamedAccounts()
   const chainId = network.config.chainId

   if(developmentChains.includes(network.name)){
      log("Local network detected! Deploying mocks...")  
      await deploy("MockV3Aggregator", {
         from: deployer,
         log: true,
         args: [DECIMALS, INITIAL_PRICE]
      })
      log("Mocks deployed")
      log("----------------------------------------------------------")
      log("You are deploying to a local network, you'll need a local nethwork to interact")
      log("Pleade run `npx hardhat console` to interact witht deployed smart contract")
      log("----------------------------------------------------------")
   }
}