const { ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")
const { verify } = require("../utils/verify")

const images_location = "./images/"

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
   let vrfCoordinatorV2Address, 
      subscriptionId, 
      vrfCoordinatorV2Mock,
      tokenUris
   
   if(process.env.UPLOAD_TO_PINATA === "true"){
      tokenUris = await handleTokenUris()
   }

   if(developmentChains.includes(network.name)){
      vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
      vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
      const transaction_response = await vrfCoordinatorV2Mock.createSubscription()
      const transaction_receipt = await transaction_response.wait()
      subscriptionId = transaction_receipt.events[0].args.subId.toString()
   }
   log("###########################################################")
   args = [
      vrfCoordinatorV2Address,
      subscriptionId,
      networkConfig[chain_id]["gasLane"],
      networkConfig[chain_id]["mintFee"],
      networkConfig[chain_id]["callbackGasLimit"],
      tokenUris
   ]

   const randomIpfsNft = await deploy("RandomIpfsNft", {
      from: deployer,
      args,
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1
   })

   if(developmentChains.includes(network.name)){
      await vrfCoordinatorV2Mock.addConsumer(subscriptionId, randomIpfsNft.address)
   }
   if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
      log("verifying...")
      await verify(randomIpfsNft.address, args)
   }
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
      return `ipfs://${metaDataResponse.IpfsHash}`
   })

   const tokenUris = await Promise.all(proxy)
   return tokenUris
}

module.exports.tags = ["all", "random"]