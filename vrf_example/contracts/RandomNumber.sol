// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract RandomNumber {
   event RequestEvent(uint256 requestId, uint32 numWords);
   event RequestFulfilled(uint256 requestId, uint256[] randomWords);

   struct RequestStatus{
      bool fulfilled;
      bool exists;
      uint256[] randomWords;
   }

   mapping(uint256 => RequestStatus) public s_requests;
   VRFCoordinatorV2Interface COORDINATOR;

}
