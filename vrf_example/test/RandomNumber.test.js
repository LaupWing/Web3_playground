const { expect } = require("chai")
const { network, ethers, getNamedAccounts, deployments } = require("hardhat")
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config")

!DEVELOPMENT_CHAINS.includes(network.name)
   ? describe.skip
   : describe("RandomNumber", function () {

      beforeEach(async () => {
         accounts = await ethers.getSigners()
         const { deployer } = await getNamedAccounts()
         await deployments.fixture(["mocks", "randomNumber"])
         const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
         console.log(deployer)
         console.log(vrfCoordinatorV2Mock)
      })

      it("generates a random number between 1 and 100", () => {

      })
   })
