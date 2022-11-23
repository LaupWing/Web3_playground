// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error RandomIpfsNft__AlreadyInitialized();
error RandomIpfsNft__NeedMoreETHSent();
error RandomIpfsNft__RangeOutOfBounds();
error RandomIpfsNft__TranferFailed();

contract RandomIpfsNft  {
   enum Breed {
      PUG,
      SHIBA_INU,
      ST_BERNARD
   }

   // For chainlink
   VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
   uint64 private immutable i_subscriptionId;
   bytes32 private immutable i_gasLane;
   uint32 private immutable i_callbackGasLimit;
   uint16 private constant REQUEST_CONFIRMATIONS = 100;
   uint32 private constant NUM_WORDS = 1;

}
