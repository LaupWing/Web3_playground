// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract RandomNumber is VRFConsumerBaseV2, ConfirmedOwner {
   event RequestSent(uint256 requestId, uint32 numWords);
   event RequestFulfilled(uint256 requestId, uint256[] randomWords);

   struct RequestStatus{
      bool fulfilled;
      bool exists;
      uint256 randomNumber;
   }

   modifier requestMustExist(uint _requestId){
      require(s_requests[_requestId].exists, "Request not found");
      _;
   }

   mapping(uint256 => RequestStatus) public s_requests;
   VRFCoordinatorV2Interface COORDINATOR;

   uint64 s_subscriptionId;

   uint256[] public requestIds;
   uint256 public lastRequestId;

   bytes32 private immutable i_gasLane;
   uint32 private constant CALLBACK_GASLIMIT = 100000;
   uint16 private constant REQUEST_CONFIRMATIONS = 3;
   uint16 private constant MAXIMUM = 100;
   uint16 private constant MINIMUM = 1;
   uint32 private constant NUM_WORDS = 1;

   constructor(
      uint64 subscription_id,
      address _vrfCoordinatorV2Address,
      bytes32 _gasLane
   )
      VRFConsumerBaseV2(_vrfCoordinatorV2Address)
      ConfirmedOwner(msg.sender)
   {
      COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinatorV2Address);
      s_subscriptionId = subscription_id;
      i_gasLane = _gasLane;
   }

   function requestRandomNumber() 
      external 
      onlyOwner 
      returns (uint256 requestId)
   {
      requestId = COORDINATOR.requestRandomWords(
         i_gasLane,
         s_subscriptionId,
         REQUEST_CONFIRMATIONS,
         CALLBACK_GASLIMIT,
         NUM_WORDS
      );
      s_requests[requestId] = RequestStatus({
         randomNumber: 0,
         exists: true,
         fulfilled: false
      });
      requestIds.push(requestId);
      lastRequestId = requestId;
      emit RequestSent(requestId, NUM_WORDS);
      return requestId;
   }

   function fulfillRandomWords(uint _requestId, uint256[] memory _randomWords) 
      internal 
      override
      requestMustExist(_requestId)
   {
      s_requests[_requestId].fulfilled = true;
      s_requests[_requestId].randomNumber = MAXIMUM%_randomWords[0] + MINIMUM;
      emit RequestFulfilled(_requestId, _randomWords);
   }

   function getRequestStatus(uint256 _requestId) 
      external 
      view 
      requestMustExist(_requestId)
      returns (RequestStatus memory request)
   {
      request = s_requests[_requestId];
      return request;
   }

   function getMaximum() public pure returns(uint256){
      return MAXIMUM;
   }
   function getMinimum() public pure returns(uint256){
      return MINIMUM;
   }
}
