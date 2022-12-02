const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const DECIMALS = "18"
const INITIAL_PRICE = "200000000000000000000"

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()

   if(developmentChains.includes(network.name)){
      log("Local network detected! Deploying mocks...")
      await deploy("MockV3Aggregator", {
         from: deployer,
         log: true,
         args: [DECIMALS, INITIAL_PRICE]
      })

      log("Mocks deployed!!!!!!!")
      log("################################################")
      log("You are deploying to a local network, you'll need alocal network running to interact")
      log("Please run `npx hardhat console --network localhost` to interact with the deployed smart contracts!")
      log("################################################")
   }
}

module.exports.tags = ["all", "mocks"]