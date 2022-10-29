const { network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")


module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()
   const isDevelopmentChain = developmentChains.includes(network.name)

   let ethUsdPricefeedAddress
   if (isDevelopmentChain) {
      const ethUsdAggregator = await deployments.get("MockV3Aggregator")
      ethUsdPricefeedAddress = ethUsdAggregator.address
   } else {
      ethUsdPricefeedAddress = networkConfig[network.config.chainId]["ethUsdPriceFeed"]
   }
   log("-------------------------------------------------------")
   log("Deploying FundMe and waiting for confirmations...")
   const fundMe = await deploy("FundMe", {
      from: deployer,
      args: [ethUsdPricefeedAddress],
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1
   })

   log(`FundMe deployed at ${fundMe.address}`)
   if (
      !isDevelopmentChain &&
      process.env.ETHERSCAN_API_KEY
   ) {
      await verify(fundMe.address, [ethUsdPricefeedAddress])
   }
}