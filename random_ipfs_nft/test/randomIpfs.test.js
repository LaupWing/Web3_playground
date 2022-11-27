const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");


!developmentChains.includes(network.name) 
   ? describe.skip
   : describe("Random IPFS NFT Unit Tests", function(){
      let randomIpfsNft, deployer, vrfCoordinatorV2Mock

      beforeEach(async ()=>{
         deployer = (await getNamedAccounts()).deployer
         
      })

      describe("Constructor", ()=>{
         it("sets starting values correctly", async ()=>{

         })
      })

      describe("requestNft", ()=>{

      })

      describe("fulfillRandomWords", ()=>{
         
      })

      describe("getBreedFromModdedRng", ()=>{

      })
   })