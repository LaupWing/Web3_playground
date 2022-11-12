const { expect } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config")

!DEVELOPMENT_CHAINS.includes(network.name)
   ? describe.skip
   : describe("RandomNumber", function () {

      beforeEach(async () => {
         accounts = await ethers.getSigners()
         const test = await getNamedAccounts()
         console.log(test)
      })

      it("generates a random number between 1 and 100", () => {

      })
   })
