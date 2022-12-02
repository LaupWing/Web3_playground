const { network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const fs = require("fs")

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
   
}
