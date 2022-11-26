const { ethers, network } = require("hardhat")
const { storeImages } = require("../utils/uploadToPinata")

const images_location = "./images/"
const FUND_AMOUNT = ethers.utils.parseEther("1").toString()

module.exports = async ({getNamedAccounts, deployments})=>{
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()
   const chain_id = network.config.chainId
   let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock
   console.log(process.env.UPLOAD_TO_PINATA)
   if(process.env.UPLOAD_TO_PINATA === "true"){
      await handleTokenUris()
   }


   console.log(FUND_AMOUNT)
   // const res = await storeImages(images_location)
   
}

async function handleTokenUris() {
   const {responses} = await storeImages(images_location)
   
}

module.exports.tags = ["all", "random"]