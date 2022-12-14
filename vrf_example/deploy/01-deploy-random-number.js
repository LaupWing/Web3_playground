const { network, ethers } = require("hardhat")
const { DEVELOPMENT_CHAINS, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const FUND_AMOUNT = ethers.utils.parseEther("1")

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
      await vrfCoordinatorV2Mock.fundSubscription(subscriptionId.toString(), FUND_AMOUNT)
   } else {
      vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
      subscriptionId = networkConfig[chainId]["subscriptionId"]
   }

   const waitBlockConfirmations = 1
   log("----------------------------------------------------------------")
   const args = [
      subscriptionId.toString(),
      vrfCoordinatorV2Address,
      networkConfig[chainId]["gasLane"],
   ]

   const randomNumber = await deploy("RandomNumber", {
      from: deployer,
      args,
      log: true,
      waitConfirmations: waitBlockConfirmations
   })

   if (DEVELOPMENT_CHAINS.includes(network.name)) {
      await vrfCoordinatorV2Mock.addConsumer(subscriptionId.toString(), randomNumber.address)
   }

   if (!DEVELOPMENT_CHAINS.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
      log("Verifying")
      await verify(randomNumber.address, args)
   }

   log("Enter lottery command:")
   const networkName = network.name == "hardhat" ? "localhost" : network.name
   log(`npx hardhat run scripts/getRandom.js --network ${networkName}`)
   log("----------------------------------------------------------------")
}

module.exports.tags = ["all", "randomNumber"]