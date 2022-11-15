const { ethers } = require("hardhat")
const fs = require("fs")
const { frontendAbiFile } = require("../helper-hardhat-config")

const updateAbi = async () => {
   const lottery = await ethers.getContract("Lottery")
   fs.writeFileSync(frontendAbiFile, lottery.interface.format(ethers.utils.FormatTypes.json))
}



module.exports = async () => {
   if (process.env.UPDATE_FRONT_END) {

   }
}



module.exports.tags = ["all", "frontend"]