const { network, ethers, getNamedAccounts, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
   ? describe.skip
   : describe("FundMe", function () {
      let fundMe
      let mockV3Aggregator
      let deployer
      const sendValue = ethers.utils.parseEther("1")

      beforeEach(async ()=>{
         deployer = (await getNamedAccounts()).deployer
         await deployments.fixture(["all"])
         fundMe = await ethers.getContract("FundMe", deployer)
         mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
         )
      })

      describe("constructor", ()=>{
         it("sets the aggreator addresses correctly", async()=>{
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
         })
      })

      describe("fund", ()=>{
         it("Fails if you don't send enough ETH", async()=>{
            await expect(fundMe.fund()).to.be.revertedWith(
               "You need to spend more ETH!"
            )
         })
      })
   })
