const { network, ethers } = require("hardhat");
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config");


DEVELOPMENT_CHAINS.includes(network.name)
   ? describe.skip
   : describe("Random Number Staging test", function () {
      let randomNumberContract

      beforeEach(async () => {
         randomNumberContract = await ethers.getContractAt("RandomNumber", "0x3fD2C9a79043b98F609C20F962D3FCE1Bc7c10B8")
         const MAXIMUM = await randomNumberContract.getMaximum()
         console.log(MAXIMUM.toString())
      })
      it("test", () => {

      })
   })
