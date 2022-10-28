const { network } = require("hardhat")


module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()

   const simpleStorage = await deploy("SimpleStorage", {
      from: deployer,
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1 
   })

   log(`SimpleStorage deployed at ${simpleStorage.address}`)
}

module.exports.tags = ["all", "simplestorage"]