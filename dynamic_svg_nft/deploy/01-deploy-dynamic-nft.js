const { network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const fs = require("fs")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()
   let ethUsdPriceFeedAddress

   if (developmentChains.includes(network.name)) {
      const EthUsdAggregator = await deployments.get("MockV3Aggregator")
      ethUsdPriceFeedAddress = EthUsdAggregator.address
   } else {
      ethUsdPriceFeedAddress = networkConfig[network.config.chainId].ethUsdPriceFeed
   }

   const lowSVG = fs.readFileSync("./images/frown.svg", {
      encoding: "utf8"
   })
   const highSVG = fs.readFileSync("./images/happy.svg", {
      encoding: "utf8"
   })

   log("--------------------------------------------------------")
   const args = [ethUsdPriceFeedAddress, lowSVG, highSVG]
   const dynamicSvgNft = await deploy("DynamicSvgNft", {
      from: deployer,
      args,
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1
   })

   if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
      log("Verifying...")
      await verify(dynamicSvgNft.address, args)
   }
}

module.exports.tags = ["all", "dynamicsvg"]
