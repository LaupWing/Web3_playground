const { network, ethers, getNamedAccounts, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { expect } = require("chai")

!developmentChains.includes(network.name)
   ? describe.skip
   : describe("FundMe", function () {
      let fundMe
      let mockV3Aggregator
      let deployer
      const sendValue = ethers.utils.parseEther("1")

      beforeEach(async () => {
         deployer = (await getNamedAccounts()).deployer
         await deployments.fixture(["all"])
         fundMe = await ethers.getContract("FundMe", deployer)
         mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
         )
      })

      describe("constructor", () => {
         it("sets the aggreator addresses correctly", async () => {
            const response = await fundMe.getPriceFeed()
            expect(response).to.equal(mockV3Aggregator.address)
         })
      })

      describe("fund", () => {
         it("fails if you don't send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
               "You need to spend more ETH"
            )
         })

         it("updates the amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddressToAmountFunded(deployer)
            expect(response.toString()).to.equal(sendValue.toString())
         })

         it("adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getFunder(0)
            expect(response).to.equal(deployer)
         })
      })
   })
