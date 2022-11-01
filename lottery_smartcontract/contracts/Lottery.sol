// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Lottery_NotEnoughETHEntered();

contract Lottery is VRFConsumerBaseV2 {
   uint256 private immutable i_entranceFee;
   address payable[] private s_players;
   VRFCoordinatorV2Interface private immutable i_vrfCoordinator;

   constructor(address _vrfCoordinatorV2,uint256 _entranceFee) VRFConsumerBaseV2(_vrfCoordinatorV2){
      i_entranceFee = _entranceFee;
      i_vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinatorV2);
   }

   function enterRaffle() public payable{
      if(msg.value < i_entranceFee){
         revert Lottery_NotEnoughETHEntered();
      }
      s_players.push(payable(msg.sender));
   }

   function requestRandomWinner() external{
      i_vrfCoordinator.requestRandomWords(
         gasLane,
         s_subscriptionId,
         requestConfirmations,
         callbackGasLimit,
         numWords
      );
   }

   function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) 
      internal 
      override
   {

   }

   function getEntranceFee() public view returns(uint256){
      return i_entranceFee;
   }

   function getPlayer(uint256 index) public view returns(address){
      return s_players[index];
   }
}