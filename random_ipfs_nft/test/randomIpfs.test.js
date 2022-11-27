const { network, ethers, getNamedAccounts, deployments } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");


!developmentChains.includes(network.name) 
   ? describe.skip
   : describe("Random IPFS NFT Unit Tests", function(){
      let randomIpfsNft, deployer, vrfCoordinatorV2Mock

      beforeEach(async ()=>{
         deployer = (await getNamedAccounts()).deployer
         await deployments.fixture(["mocks", "random"])
         randomIpfsNft = await ethers.getContract("RandomIpfsNft")
         vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
         
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