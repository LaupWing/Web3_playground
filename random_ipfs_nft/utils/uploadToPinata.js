const pinata_sdk = require("@pinata/sdk")
const fs = require("fs")
const path = require("path")
const isImage = require("is-image")

const pinata_api_key = process.env.PINATA_API_KEY || ""
const pinata_api_secret = process.env.PINATA_API_SECRET || ""
const pinata = new pinata_sdk(pinata_api_key, pinata_api_secret)

async function storeImages(images_file_path){
   const full_images_path = path.resolve(images_file_path)
   
   const files = fs
      .readdirSync(full_images_path)
      .filter(file=> isImage(file))
   
   const proxy = files
      .map(async file =>{
         const options = {
            pinataMetadata:{
               name: file
            }
         }
         const readableStream = fs.createReadStream(`${full_images_path}/${file}`)
         try{
            const res = await pinata.pinFileToIPFS(readableStream, options)
            return res
         }catch(e){
            console.log(e.message)
         }
      })
   const responses = await Promise.all(proxy) 
   return {
      responses, 
      files
   }
}

async function storeTokenUriMetadata(metadata){
   const options = {
      pinataMetadata:{
         name: metadata.name
      }
   }
   try{
      const response = await pinata.pinJSONToIPFS(metadata, options)
      return response
   }catch(e){
      console.log(e)
   }
   return null
}

module.exports = {
   storeImages,
   storeTokenUriMetadata
}