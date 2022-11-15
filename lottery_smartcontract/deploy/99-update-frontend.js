const { ethers, network } = require("hardhat")
const fs = require("fs")
const { frontendAbiFile, frontendContractsFile } = require("../helper-hardhat-config")

const updateAbi = async () => {
   const lottery = await ethers.getContract("Lottery")
   console.log(lottery.address)
   fs.writeFileSync(frontendAbiFile, lottery.interface.format(ethers.utils.FormatTypes.json))
}

const updateContractAddresses = async () => {
   const lottery = await ethers.getContract("Lottery")
   const contractAddresses = JSON.parse(fs.readFileSync(frontendContractsFile, "utf-8"))
   if (network.config.chainId.toString() in contractAddresses) {
      if (!contractAddresses[network.config.chainId.toString()].includes(lottery.address)) {
         contractAddresses[network.config.chainId.toString()].push(lottery.address)
      }
   } else {
      contractAddresses[network.config.chainId.toString()] = [lottery.address]
   }
   fs.writeFileSync(frontendContractsFile, JSON.stringify(contractAddresses))
}

module.exports = async () => {
   if (process.env.UPDATE_FRONT_END) {
      console.log("Writing to frontend...")
      await updateContractAddresses()
      await updateAbi()
      console.log("Written to frontend")
   }
}



module.exports.tags = ["all", "frontend"]