import React, { useEffect, useState } from 'react'
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"

const LotteryEntrance = () => {
   const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
   const chainId = parseInt(chainIdHex)
   const lotteryAddress = chainId in contractAddresses
      ? contractAddresses[chainId][0]
      : null

   const [entranceFee, setEntranceFee] = useState("0")
   const [numberOfPlayers, setNumberOfPlayers] = useState("0")
   const [recentWinner, setRecentWinner] = useState("0")

   const dispatch = useNotification()

   const {
      runContractFunction: enterLottery,
      data: enterTxResponse,
      isLoading,
      isFetching
   } = useWeb3Contract({
      abi,
      contractAddress: lotteryAddress,
      functionName: "enterLottery",
      msgValue: entranceFee,
      params: {}
   })

   const { runContractFunction: getEntranceFee } = useWeb3Contract({
      abi,
      contractAddress: lotteryAddress,
      functionName: "getEntranceFee",
      params: {}
   })

   const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
      abi,
      contractAddress: lotteryAddress,
      functionName: "getNumberOfPlayers",
      params: {}
   })

   const { runContractFunction: getRecentWinner } = useWeb3Contract({
      abi,
      contractAddress: lotteryAddress,
      functionName: "getRecentWinner",
      params: {}
   })


   const updateUI = async () => {
      setEntranceFee((await getEntranceFee()).toString())
      setNumberOfPlayers((await getNumberOfPlayers()).toString())
      setRecentWinner(await getRecentWinner())
   }

   useEffect(() => {
      if (isWeb3Enabled) {
         updateUI()
      }
   }, [isWeb3Enabled])

   const handleNewNotification = () => {
      dispatch({
         type: "info",
         message: "Transaction Completed!",
         title: "Transaction Notification",
         position: "topR",
         icon: "bell"
      })
   }

   const handleSuccess = async (tx) => {
      try {
         await tx.wait(1)
         updateUI()
         handleNewNotification(tx)
      } catch (err) {
         console.error(err)
      }
   }

   return (
      <div className="p-5">
         <h1 className="p-4 font-bold text-3xl">Lottery</h1>
         {lotteryAddress ? (
            <>
               <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                  onClick={async () =>
                     await enterLottery({
                        onSuccess: handleSuccess,
                        onError: err => console.error(err)
                     })
                  }
                  disabled={isLoading || isFetching}
               >
                  {isLoading || isFetching ? (
                     <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                  ) : (
                     "Enter Raffle"
                  )}
               </button>
               <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
               <div>The current number of players: {numberOfPlayers}</div>
               <div>The previous winner was: {recentWinner}</div>
            </>
         ) : (
            <div>Please connect to a supported chain</div>
         )}
      </div>
   )
}

export default LotteryEntrance