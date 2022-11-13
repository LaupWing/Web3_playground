const { network, ethers } = require("hardhat");
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config");


DEVELOPMENT_CHAINS.includes(network.name)
   ? describe.skip
   : describe("Random Number Staging test", function () {
      let randomNumberContract

      beforeEach(async () => {
         randomNumberContract = await ethers.getContractAt(
            "RandomNumber",
            "0x97CdcF86Dc624a1942D1729770e39c2DD23ce44e"
         )
         // const MAXIMUM = await randomNumberContract.getMaximum()
      })
      it("test", () => {

      })
   })
