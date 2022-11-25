const { storeImages } = require("../utils/uploadToPinata")

const images_location = "./images/"

module.exports = async ({getNamedAccounts, deployments})=>{
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()

   storeImages(images_location)
}

module.exports.tags = ["all", "random"]