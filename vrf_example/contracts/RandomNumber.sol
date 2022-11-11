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
      uint256[] randomWords;
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

   bytes32 gasLane = 0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15;
   uint32 callbackGasLimit = 100000;
   uint16 private constant REQUEST_CONFIRMATIONS = 3;
   uint32 numWords = 1;

   constructor(uint64 subscription_id)
      VRFConsumerBaseV2(0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D)
      ConfirmedOwner(msg.sender)
   {
      COORDINATOR = VRFCoordinatorV2Interface(0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D);
      s_subscriptionId = subscription_id;
   }

   function requestRandomNumber() external onlyOwner returns (uint256 requestId){
      requestId = COORDINATOR.requestRandomWords(
         gasLane,
         s_subscriptionId,
         REQUEST_CONFIRMATIONS,
         callbackGasLimit,
         numWords
      );
      s_requests[requestId] = RequestStatus({
         randomWords: new uint256[](0),
         exists: true,
         fulfilled: false
      });
      requestIds.push(requestId);
      lastRequestId = requestId;
      emit RequestSent(requestId, numWords);
      return requestId;
   }

   function fulfillRandomWords(uint _requestId, uint256[] memory _randomWords) 
      internal 
      override
      requestMustExist(_requestId)
   {
      s_requests[_requestId].fulfilled = true;
      s_requests[_requestId].randomWords = _randomWords;
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
}
