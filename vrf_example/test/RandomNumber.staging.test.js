const { network, ethers, getNamedAccounts } = require("hardhat");
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config");


DEVELOPMENT_CHAINS.includes(network.name)
   ? describe.skip
   : describe("Random Number Staging test", function () {
      let randomNumberContract, deployer

      beforeEach(async () => {
         deployer = (await getNamedAccounts()).deployer
         randomNumberContract = await ethers.getContractAt(
            "RandomNumber",
            "0x97CdcF86Dc624a1942D1729770e39c2DD23ce44e",
            deployer
         )
         // const MAXIMUM = await randomNumberContract.getMaximum()
      })
      it("test", async () => {
         await new Promise(async (resolve, reject) => {
            randomNumberContract.once("RequestFulfilled", (e) => {
               try {
                  console.log("Request is fulfilled!")
                  console.log(e)
                  resolve()
               } catch (err) {
                  console.log(err)
                  reject(err)
               }

            })

            console.log("Requesting a new random number")
            const transaction = await randomNumberContract.requestRandomNumber()
            transaction.wait(1)
            console.log("Okay time to wait")
         })
      })
   })
