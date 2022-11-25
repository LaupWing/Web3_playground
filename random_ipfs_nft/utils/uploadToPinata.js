const pinataSDK = require("@pinata/sdk")
const fs = require("fs")
const path = require("path")

const pinata_api_key = process.env.PINATA_API_KEY || ""
const pinata_api_secret = process.env.PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(images_file_path){
   const full_images_path = path.resolve(images_file_path)
     
}