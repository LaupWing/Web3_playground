const { ethers, network } = require("hardhat")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")

const images_location = "./images/"
const FUND_AMOUNT = ethers.utils.parseEther("1").toString()

const metadataTemplate = {
   name: "",
   description: "",
   image: "",
   attributes:[
      {
         trait_type: "Power",
         value: 100
      }
   ]
}

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
   const { responses, files} = await storeImages(images_location)
   
   const proxy = responses.map(async (res, i) =>{
      const tokenUriMetadata = {
         ...metadataTemplate
      }
      tokenUriMetadata.name = `Laup ${files[i].replace(".png", "")}`
      tokenUriMetadata.description =  `${tokenUriMetadata.name} will destroy you`
      tokenUriMetadata.image = `ipfs://${res.IpfsHash}`

      const metaDataResponse = await storeTokenUriMetadata(tokenUriMetadata)
      return metaDataResponse
   })

   const tokenUris = await Promise.all(proxy)
   console.log(tokenUris)
   
}

module.exports.tags = ["all", "random"]