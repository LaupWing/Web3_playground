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

      describe("withdraw", () => {
         const provider = ethers.provider
         beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
         })

         it("withdraws ETH from a single user", async () => {
            const startingFundBalance = await provider.getBalance(fundMe.address)
            const startingDeployerBalance = await provider.getBalance(deployer)

            const transationResponse = await fundMe.withdraw()
            const transactionReceipt = await transationResponse.wait()
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await provider.getBalance(fundMe.address)
            const endingDeployerBalance = await provider.getBalance(deployer)

            expect(endingFundMeBalance.toString()).to.equal("0")
            expect(
               startingFundBalance.add(startingDeployerBalance).toString()
            ).to.equal(
               endingDeployerBalance.add(gasCost).toString()
            )

         })

         it("allows us to withdraw with mutliple funders", async () => {
            const accounts = await ethers.getSigners()

            for (i = 1; i < 6; i++) {
               const fundMeConnectedContract = await fundMe.connect(
                  accounts[i]
               )
               await fundMeConnectedContract.fund({ value: sendValue })
            }
            const startingFundBalance = await provider.getBalance(fundMe.address)
            const startingDeployerBalance = await provider.getBalance(deployer)

            const transationResponse = await fundMe.withdraw()
            const transactionReceipt = await transationResponse.wait()
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const withdrawCost = gasUsed.mul(effectiveGasPrice)
            console.log(`Total gascost is: ${withdrawCost}`)
            console.log(`Gas used is: ${gasUsed}`)
            console.log(`Gas price is: ${effectiveGasPrice}`)

            const endingFundMeBalance = await provider.getBalance(fundMe.address)
            const endingDeployerBalance = await provider.getBalance(deployer)

            expect(startingFundBalance.add(startingDeployerBalance).toString())
               .to.equal(endingDeployerBalance.add(withdrawCost).toString())
            
            await expect(fundMe.getFunder(0)).to.be.reverted

            for(i = 1; i < 6; i++){
               expect(await fundMe.getAddressToAmountFunded(accounts[i].address)).to.equal("0")
            }
         })
      })
   })
