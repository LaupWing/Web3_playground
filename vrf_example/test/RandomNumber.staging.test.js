const { network, ethers, getNamedAccounts } = require("hardhat");
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config");
const { expect } = require("chai")

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
            randomNumberContract.once("RequestFulfilled", async (request_id, randomNumber) => {
               console.log("Request is fulfilled!")
               try {
                  const last_request_id = await randomNumberContract.lastRequestId()
                  const requestStatus = await randomNumberContract.getRequestStatus(request_id)
                  console.log(last_request_id)
                  console.log(request_id)
                  console.log(requestStatus.randomNumber.toString())
                  expect(last_request_id).equal(request_id)
                  expect(requestStatus.exists).equal(true)
                  resolve()
               } catch (err) {
                  console.log(err)
                  reject(err)
               }
            })

            console.log("Requesting a new random number")
            const transaction = await randomNumberContract.requestRandomNumber()
            const last_request_id = await randomNumberContract.lastRequestId()
            transaction.wait(1)
            console.log(transaction)
            console.log(last_request_id.toString())
            console.log("Okay time to wait")
         })
      })
   })
