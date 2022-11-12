const { expect } = require("chai")
const { network, ethers, getNamedAccounts, deployments } = require("hardhat")
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config")

!DEVELOPMENT_CHAINS.includes(network.name)
   ? describe.skip
   : describe("RandomNumber", function () {

      let vrfCoordinatorV2Mock, randomNumberContract

      beforeEach(async () => {
         accounts = await ethers.getSigners()
         const { deployer } = await getNamedAccounts()
         await deployments.fixture(["mocks", "randomNumber"])
         vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
         randomNumberContract = await ethers.getContract("RandomNumber")
      })

      it("generates a random number between 1 and 100", () => {

      })
      it("get a minimum and maximum", async () => {
         console.log((await randomNumberContract.getMaximum()).toString())
         console.log((await randomNumberContract.getMinimum()).toString())
      })
   })
