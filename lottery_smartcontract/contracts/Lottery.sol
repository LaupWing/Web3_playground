// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Lottery_NotEnoughETHEntered();

contract Lottery is VRFConsumerBaseV2 {
   enum RaffleState {
      OPEN,
      CALCULATING
   }
   // ChainLink VRF variables
   VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
   uint64 private immutable i_subscriptionId;
   bytes32 private immutable i_gasLane;
   uint32 private immutable i_callbackGasLimit;
   uint16 private constant REQUEST_CONFIRMATIONS = 3;
   uint32 private constant NUM_WORDS = 1;

   // Lottery variables
   uint256 private immutable i_interval;
   uint256 private immutable i_entranceFee;
   uint256 private s_lastTimestamp;
   address private s_recentWinner;
   address payable[] private s_players;
   RaffleState private s_raffleState;

   event RequestedRaffleWinner(uint256 indexed requestId);
   event RaffleEnter(address indexed player);
   event WinnerPicked(address indexed player);

   constructor(
      address _vrfCoordinatorV2,
      uint256 _entranceFee,
      uint64 _subscriptionId,
      bytes32 _gasLane,
      uint256 _interval,
      uint32 _callbackGasLimit
   ) VRFConsumerBaseV2(_vrfCoordinatorV2){
      i_vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinatorV2);
      i_gasLane = _gasLane;
      i_interval = _interval;
      i_subscriptionId = _subscriptionId;
      i_entranceFee = _entranceFee;
      s_raffleState = RaffleState.OPEN;
      s_lastTimestamp = block.timestamp;
      i_callbackGasLimit = _callbackGasLimit;
   }

   function enterRaffle() public payable{
      if(msg.value < i_entranceFee){
         revert Lottery_NotEnoughETHEntered();
      }
      s_players.push(payable(msg.sender));
   }

   function requestRandomWinner() external{
      i_vrfCoordinator.requestRandomWords(
         i_gasLane,
         i_subscriptionId,
         REQUEST_CONFIRMATIONS,
         i_callbackGasLimit,
         NUM_WORDS
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