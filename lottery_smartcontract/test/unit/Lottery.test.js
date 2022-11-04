const { expect, assert } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");


!developmentChains.includes(network.name)
   ? describe.skip
   : describe("Lottery Unit Tests", function () {
      let lottery, lotteryContract, vrfCoordinatorV2Mock, lotteryEntranceFee, interval, player

      beforeEach(async () => {
         accounts = await ethers.getSigners()
         player = accounts[1]
         await deployments.fixture(["mocks", "lottery"])
         vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")

         lotteryContract = await ethers.getContract("Lottery")
         lottery = lotteryContract.connect(player)
         lotteryEntranceFee = await lottery.getEntranceFee()
         interval = await lottery.getInterval()
      })

      describe("constructor", function () {
         it("initializes the lottery correctly", async () => {
            const lotteryState = (await lottery.getLotteryState()).toString()
            expect(lotteryState).to.equal("0")
            expect(interval.toString(), networkConfig[network.config.chainId]["keepersUpdateInterval"])
         })
      })

      describe("enterLottery", function () {
         it("reverts when you don't pay enough", async () => {
            await expect(lottery.enterLottery()).to.be.revertedWithCustomError(lottery, "Lottery__NotEnoughETHEntered")
         })

         it("records player when they enter", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee })
            const contractPlayer = await lottery.getPlayer(0)
            expect(player.address, contractPlayer)
         })

         it("emit event on enter", async () => {
            await expect(lottery.enterLottery({ value: lotteryEntranceFee })).to.emit(lottery, "LotteryEnter")
         })

         it("doesn't allow entrance when lottery is calculating", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
            await lottery.performUpkeep([])
            await expect(lottery.enterLottery({ value: lotteryEntranceFee })).to.be.revertedWithCustomError(lottery, "Lottery__LotteryNotOpen")

         })
      })
      describe("checkUpkeep", function () {
         it("returns false people haven't sent any ETH", async () => {
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
            const { upkeepNeeded } = await lottery.callStatic.checkUpkeep("0x")
            expect(upkeepNeeded).to.equal(false)
         })

         it("returns false if lottery isn't open", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
            await lottery.performUpkeep([])
            const lotteryState = await lottery.getLotteryState()
            const { upkeepNeeded } = await lottery.callStatic.checkUpkeep("0x")

            expect(lotteryState.toString()).equal("1")
            expect(upkeepNeeded).equal(false)
         })

         it("returns false if enough time hasn't passed", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() - 20])
            await network.provider.request({ method: "evm_mine", params: [] })
            const { upkeepNeeded } = await lottery.callStatic.checkUpkeep("0x")
            expect(upkeepNeeded).equal(false)
         })

         it("returns true if enough time has passed, has players, eth, and is open", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
            const { upkeepNeeded } = await lottery.callStatic.checkUpkeep("0x")
            expect(upkeepNeeded).equal(true)
         })
      })

      describe("performUpkeep", function () {
         it("can only run if checkupkeep is true", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
            const tx = await lottery.performUpkeep("0x")
            expect(tx).to.exist
         })

         it("reverts if checkup is false", async () => {
            await expect(lottery.performUpkeep("0x")).to.be.revertedWithCustomError(lottery, "Lottery__UpkeepNotNeeded")
         })

         it("updates the lottery state and emits a requestId", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
            const txResponse = await lottery.performUpkeep("0x")
            const txReceipt = await txResponse.wait(1)
            const lotteryState = await lottery.getLotteryState()
            const requestId = txReceipt.events[1].args.requestId

            expect(requestId.toNumber()).to.be.greaterThan(0)
            expect(lotteryState).equal(1)
         })
      })

      describe("fulfillRandomWords", function () {
         beforeEach(async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
         })

         it("picks a winner, resets, and sends money", async () => {
            const additonalEntrances = 3
            const startingIndex = 2
            for (let i = startingIndex; i < startingIndex + additonalEntrances; i++) {
               lottery = lotteryContract.connect(accounts[i])
            }
            const startingTime = await lottery.getLastTimestamp()

            await new Promise(async (resolve, reject) => {
               lottery.once("WinnerPicked", async () => {
                  console.log("WinnerPicked event fired!")
                  console.log(startingTime, startingBalance)
               })

               const tx = await lottery.performUpkeep("0x")
               const txReceipt = await tx.wait(1)
               const startingBalance = await accounts[2].getBalance()
               await vrfCoordinatorV2Mock.fulfillRandomWords(
                  txReceipt.events[1].args.requestId,
                  lottery.address
               )
            })
         })
      })
   })