const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = "250000000000000000"
const GAS_PRICE_LINK = 1e9

module.exports = async ({getNamedAccounts, deployments})=>{
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()

   if(developmentChains.includes(network.name)){
      console.log("Local network detected! Deploying mocks...")
      await deploy("VRFCoordinatorV2Mock", {
         from: deployer,
         log: true,
         args: [BASE_FEE, GAS_PRICE_LINK]
      })

      log("Mocks deployed!")
      log("################################################################")
      log("You are deploying to local network, you'll need a local network running to interact")
      log("Please run `npx hardhat console --network localhost` to interact with the deployed contracts!!")
      log("################################################################")
   }
}

module.exports.tags = ["all", "mocks", "main"]