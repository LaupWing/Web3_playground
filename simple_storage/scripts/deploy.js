const { ethers, network } = require("hardhat")


async function main(){
   const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
   console.log("Deploying contract...")
   const simpleStorage = await SimpleStorageFactory.deploy()
   await simpleStorage.deployed()
   
   if(network.config.chainId === 42 && process.env.ETHERSCAN_API_KEY){
      await simpleStorage.deployTransaction.wait(6)
      
   }
}

main()
   .then(()=> process.exit(0))
   .catch(err =>{
      console.error(err)
      process.exit(1)
   })