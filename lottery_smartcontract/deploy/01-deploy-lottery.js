const { network, ethers } = require("hardhat")

const FUND_AMOUNT = ethers.utils.parseEther("1")

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()
   const chainId = network.config.chainId
   let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock

   if (chainId === 31337) {
      vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
      vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
      const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
      const transactionReceipt = await transactionResponse.wait()
      subscriptionId = transactionReceipt.events[0].args.subId

      await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
   } else {
      vrfCoordinatorV2Address
   }
}