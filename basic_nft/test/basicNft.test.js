const { network, ethers, getNamedAccounts, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
   ? describe.skip
   : describe("Basic NFT Unit Tests", function () {
      let basicNft, deployer

      beforeEach(async () => {
         accounts = await ethers.getSigners()
         deployer = (await getNamedAccounts()).deployer
         await deployments.fixture(["basicnft"])
         basicNft = await ethers.getContract("BasicNft")
      })
      
      describe("Constructor", ()=>{
         it("Initializes the NFT Correctly", async ()=>{
            const name = await basicNft.name()
            const symbol = await basicNft.symbol()
            const tokenCounter = await basicNft.getTokenCounter()
            console.log(tokenCounter.toString())
            const tokenURI = await basicNft.tokenURI(0)
            console.log(tokenURI)
            console.log(await basicNft.TOKEN_URI())
            
         })
      })

      // describe("Mint NFT", ()=>{
      //    beforeEach(async ()=>{
      //       const transaction_response = await basicNft.mintNft()
      //       await transaction_response.wait(1)
      //    })
      // })
   })
