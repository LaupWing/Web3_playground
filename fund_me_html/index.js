import { abi, contractAddress } from "./constants.js"
import { ethers } from "./ethers-5.2.esm.min.js"


document.getElementById("connectButton").addEventListener("click", connect)
document.getElementById("fundButton").addEventListener("click", fund)
document.getElementById("withdrawButton").addEventListener("click",withdraw)
const balanceButton = document.getElementById("balanceButton")
balanceButton.addEventListener("click", getBalance)



async function connect() {
   if (typeof window.ethereum !== "undefined") {
      try {
         await ethereum.request({ method: "eth_requestAccounts" })
      } catch (e) {
         console.log(e)
      }
      connectButton.innerHTML = "Connected"
      const accounts = await ethereum.request({ method: "eth_accounts" })
      console.log(accounts)
   }
}

async function fund(){
   const ethAmount = document.getElementById("ethAmount").value
   console.log(ethAmount)
   if(typeof window.ethereum !== "undefined"){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try{
         const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount)
         })
         await listenForTransactionMine(transactionResponse, provider)
      }catch(e){
         console.error(e)
      }
   }
}

async function withdraw(){
   console.log("Withdrawing...")

   if(typeof window.ethereum !== "undefined"){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)

      try{
         const transactionResponse = await contract.withdraw()
         await listenForTransactionMine(transactionResponse, provider)
      }catch(e){
         console.error(e)
      }
   }
}

async function getBalance(){
   if(typeof window.ethereum != "undefined"){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      try{
         const balance = await provider.getBalance(contractAddress)
         console.log(balance)
         console.log(ethers.utils.formatEther(balance))
      }catch(e){
         console.error(e)
      }
   }else{
      balanceButton.innerHTML = "Please install MetaMask"
   }
}

function listenForTransactionMine(transactionResponse, provider){
   console.log(`Mining ${transactionResponse.hash}`)
   return new Promise((resolve, reject)=>{
      try{
         provider.once(transactionResponse.hash, (transactionReceipt)=>{
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
         })
         resolve()
      }catch(e){
         reject(e)
      }
   })
}