// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Lottery__UpkeepNotNeeded(uint256 currrentBalance, uint256 numPlayers, uint256 raffleState);
error Lottery__NotEnoughETHEntered();
error Lottery__TransferFailed();
error Lottery__LotteryNotOpen();

contract Lottery is VRFConsumerBaseV2, KeeperCompatibleInterface {
   enum LotteryState {
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
   LotteryState private s_lotteryState;

   event RequestedLotteryWinner(uint256 indexed requestId);
   event LotteryEnter(address indexed player);
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
      s_lotteryState = LotteryState.OPEN;
      s_lastTimestamp = block.timestamp;
      i_callbackGasLimit = _callbackGasLimit;
   }

   function enterLottery() public payable{
      if(msg.value < i_entranceFee){
         revert Lottery__NotEnoughETHEntered();
      }
      if(s_lotteryState != LotteryState.OPEN){
         revert Lottery__LotteryNotOpen();
      }
      s_players.push(payable(msg.sender));
      emit LotteryEnter(msg.sender);
   }

   function checkUpkeep(
      bytes memory /* checkData */
   ) 
      public
      view
      override
      returns (
         bool upkeepNeeded,
         bytes memory /* performData */
      )
   {
      bool isOpen = LotteryState.OPEN == s_lotteryState;
      bool timePassed = ((block.timestamp - s_lastTimestamp) > i_interval);
      bool hasPlayers = s_players.length > 0;
      bool hasBalance = address(this).balance > 0;
      upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers);
      return (upkeepNeeded, "0x0");
   }

   function performUpkeep(
      bytes calldata /* performData */
   ) external override{
      (bool upkeepNeeded, ) = checkUpkeep("");
      if(!upkeepNeeded){
         revert Lottery__UpkeepNotNeeded(
            address(this).balance,
            s_players.length,
            uint256(s_lotteryState)
         );
      }
      s_lotteryState = LotteryState.CALCULATING;
      uint256 requestId = i_vrfCoordinator.requestRandomWords(
         i_gasLane,
         i_subscriptionId,
         REQUEST_CONFIRMATIONS,
         i_callbackGasLimit,
         NUM_WORDS
      );
      emit RequestedLotteryWinner(requestId);
   }

   function fulfillRandomWords(
      uint256 /* requestId */, 
      uint256[] memory randomWords
   ) 
      internal 
      override
   {
      uint256 indexOfWinner = randomWords[0]  % s_players.length;
      address payable recentWinner = s_players[indexOfWinner];
      s_recentWinner = recentWinner;
      s_players = new address payable[](0);
      s_lotteryState = LotteryState.OPEN;
      s_lastTimestamp = block.timestamp;
      (bool success,) = recentWinner.call{value: address(this).balance}("");
      if(!success){
         revert Lottery__TransferFailed();
      }
      emit WinnerPicked(recentWinner);
   }

   function getEntranceFee() public view returns(uint256){
      return i_entranceFee;
   }

   function getPlayer(uint256 index) public view returns(address){
      return s_players[index];
   }

   function getLotteryState() public view returns (LotteryState) {
      return s_lotteryState;
   }

   function getNumWords() public pure returns (uint256) {
      return NUM_WORDS;
   }

   function getRequestConfirmations() public pure returns (uint256) {
      return REQUEST_CONFIRMATIONS;
   }

   function getRecentWinner() public view returns (address) {
      return s_recentWinner;
   }

   function getLastTimestamp() public view returns (uint256) {
      return s_lastTimestamp;
   }

   function getInterval() public view returns (uint256) {
      return i_interval;
   }

   function getNumberOfPlayers() public view returns (uint256) {
      return s_players.length;
   }
}