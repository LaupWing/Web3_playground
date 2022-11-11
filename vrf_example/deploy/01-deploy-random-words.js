const { network, ethers } = require("hardhat")
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config")


module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()
   const chainId = network.config.chainId
   let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock

   if (DEVELOPMENT_CHAINS.includes(network.name)) {
      vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
      vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address

      const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
      const transactionReceipt = await transactionResponse.wait()
      subscriptionId = transactionReceipt.events[0].args.subId

   }
}