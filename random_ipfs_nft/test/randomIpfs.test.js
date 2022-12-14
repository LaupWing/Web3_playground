const { expect } = require("chai")
const { network, ethers, getNamedAccounts, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name) 
   ? describe.skip
   : describe("Random IPFS NFT Unit Tests", function(){
      let randomIpfsNft, deployer, vrfCoordinatorV2Mock

      beforeEach(async ()=>{
         deployer = (await getNamedAccounts()).deployer
         await deployments.fixture(["mocks", "random"])
         randomIpfsNft = await ethers.getContract("RandomIpfsNft")
         vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
      })

      describe("Constructor", ()=>{
         it("sets starting values correctly", async ()=>{
            const dogTokenUri = await randomIpfsNft.getDogTokenUri(0)
            const initialized = await randomIpfsNft.getInitialized()

            expect(dogTokenUri).to.include("ipfs")
            expect(initialized).to.equal(true)
         })
      })

      describe("requestNft", ()=>{
         it("reverts when no ETH is send", async ()=>{
            await expect(randomIpfsNft.requestNft())
               .to
               .be
               .revertedWithCustomError(
                  randomIpfsNft,
                  "RandomIpfsNft__NeedMoreETHSent"
               )
         })

         it("reverts when there is less ETH send", async ()=>{
            await expect(randomIpfsNft.requestNft({
               value: ethers.utils.parseEther("0.000001")
            }))
               .to
               .be
               .revertedWithCustomError(
                  randomIpfsNft,
                  "RandomIpfsNft__NeedMoreETHSent"
               )
         })

         it("emits nft requested event", async ()=>{
            const mint_fee = (await randomIpfsNft.getMintFee()).toString()

            await expect(randomIpfsNft.requestNft({
               value: mint_fee
            }))
               .to.emit(randomIpfsNft, "NftRequested")
               .withArgs(1, deployer)
         })

         it("registers request id to sender", async ()=>{
            const mint_fee = (await randomIpfsNft.getMintFee()).toString()

            await randomIpfsNft.requestNft({
               value: mint_fee
            })
            const requestSender = await randomIpfsNft.s_requestIdToSender(1)
            expect(requestSender).to.equal(deployer)
         })
      })

      describe("fulfillRandomWords", ()=>{
         it("mints NFT after random number has been returned", async ()=>{
            await new Promise(async (resolve, reject)=>{
               randomIpfsNft.once("NftMinted", async (e)=>{
                  const tokenCounter = (await randomIpfsNft.getTokenCounter()).toString()
                  expect(await randomIpfsNft.ownerOf("0")).equal(deployer)
                  expect((await randomIpfsNft.tokenURI("0"))).include("ipfs")
                  expect((await randomIpfsNft.balanceOf(deployer)).toString()).equal("1")
                  expect(tokenCounter).equal("1")
                  resolve()
               })

               try{
                  const mint_fee = (await randomIpfsNft.getMintFee()).toString()

                  const transaction_response = await randomIpfsNft.requestNft({
                     value: mint_fee
                  })
                  const transaction_receipt = await transaction_response.wait(1)
                  const eventArgs = transaction_receipt.events[1].args
                  
                  await vrfCoordinatorV2Mock.fulfillRandomWords(
                     eventArgs.requestId.toString(),
                     randomIpfsNft.address
                  )
               }catch(e){
                  console.log(e)
                  reject(e)
               }
            })
         })
      })

      describe("getBreedFromModdedRng", ()=>{
         it("reverts with range out of bounds", async ()=>{
            await expect(randomIpfsNft.getBreedFromModdedRng(120))
               .to
               .be
               .revertedWithCustomError(
                  randomIpfsNft,
                  "RandomIpfsNft__RangeOutOfBounds"
               )
         })

         it("returns the PUG Breed", async ()=>{
            expect((await randomIpfsNft.getBreedFromModdedRng(7))).equal(0)
         })
         it("returns the SHIBA_INU Breed", async ()=>{
            expect((await randomIpfsNft.getBreedFromModdedRng(30))).equal(1)
         })
         it("returns the ST_BERNARD Breed", async ()=>{
            expect((await randomIpfsNft.getBreedFromModdedRng(95))).equal(2)
         })
      })
   })