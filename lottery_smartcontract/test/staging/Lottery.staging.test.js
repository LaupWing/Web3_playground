const { expect } = require("chai");
const { network, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");


developmentChains.includes(network.name)
   ? describe.skip
   : describe("Lottery Staging Tests", function () {
      let lottery, lotteryEntranceFee, deployer

      beforeEach(async () => {
         deployer = (await getNamedAccounts()).deployer
         lottery = await ethers.getContract("Lottery", deployer)
         lotteryEntranceFee = await lottery.getEntranceFee()
      })

      describe("fulfillRandomWords", function () {
         it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async () => {
            console.log("Setting up test")
            const startingTimestamp = await lottery.getLastTimestamp()
            const accounts = await ethers.getSigners()

            console.log("Setting up Listener...")
            await new Promise(async (resolve, reject) => {
               lottery.once("WinnerPicked", async () => {
                  console.log("WinnerPicked event fired!")
                  try {
                     const recentWinner = await lottery.getRecentWinner()
                     const lotteryState = await lottery.getLotteryState()
                     const winnerEndingBalance = await accounts[0].getBalance()
                     const endingTimestamp = await lottery.getLastTimestamp()

                     await expect(lottery.getPlayer(0)).to.be.reverted
                     expect(recentWinner.toString()).equal(accounts[0].address)
                     expect(lotteryState, 0)
                     expect(winnerEndingBalance.toString()).equal(winnerStartingBalance.add(lotteryEntranceFee).toString())
                     expect(endingTimestamp).greaterThan(startingTimestamp)
                     resolve()
                  } catch (e) {
                     console.log(e)
                     reject(e)
                  }
               })

               console.log("Enter Lottery...")
               const tx = await lottery.enterLottery({ value: lotteryEntranceFee })
               await tx.wait(1)
               console.log("Ok, time to wait...")
               const winnerStartingBalance = await accounts[0].getBalance()
            })
         })
      })
   })