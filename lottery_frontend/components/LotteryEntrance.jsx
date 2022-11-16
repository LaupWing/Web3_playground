import React, { useEffect, useState } from 'react'
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import { abi, contractAddresses } from "../constants"

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

   const updateUI = async () => {
      const test = await getEntranceFee()
      console.log(test.toString())
   }

   useEffect(() => {
      updateUI()
   }, [])

   return (
      <div>LotteryEntrance</div>
   )
}

export default LotteryEntrance