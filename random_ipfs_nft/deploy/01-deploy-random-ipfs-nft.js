const { storeImages } = require("../utils/uploadToPinata")

const images_location = "./images/"

module.exports = async ({getNamedAccounts, deployments})=>{
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()

   const res = await storeImages(images_location)
   console.log(res)

}

module.exports.tags = ["all", "random"]