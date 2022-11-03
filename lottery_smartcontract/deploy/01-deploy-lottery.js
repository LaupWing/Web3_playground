const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

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
      vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
      subscriptionId = networkConfig[chainId]["subscriptionId"]
   }

   const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS
   log("--------------------------------------------------------------------")
   const args = [
      vrfCoordinatorV2Address,
      networkConfig[chainId]["lotteryEntranceFee"].toString(),
      subscriptionId.toString(),
      networkConfig[chainId]["gasLane"],
      networkConfig[chainId]["keepersUpdateInterval"],
      networkConfig[chainId]["callbackGasLimit"]
   ]

   const lottery = await deploy("Lottery", {
      from: deployer,
      args,
      log: true,
      waitConfirmations: waitBlockConfirmations
   })
   await vrfCoordinatorV2Mock.addConsumer(subscriptionId.toNumber(), lottery.address)

   if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
      log("Verifying...")
      await verify(lottery.address, args)
   }

   log("Enter lottery command:")
   const networkName = network.name == "hardhat" ? "localhost" : network.name
   log(`npx hardhat run scripts/enterLottery.js --network ${networkName}`)
   log("------------------------------------------------------------")
}

module.exports.tags = ["all", "lottery"]