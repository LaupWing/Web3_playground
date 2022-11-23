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

   // NFT variables
   uint256 private immutable i_mintFee;
   uint256 private s_tokenCounter;
   uint256 internal constant MAX_CHANCE_VALUE = 100;
   string[] internal s_dogTokenUris;
   bool private s_initialized;

   // VRF Helpers
   mapping(uint256 => address) public s_requestIdToSender;

   event NftRequested(uint256 indexed requestId, address requester);
   event NftMinted(Breed breed, address minter);

   constructor(
      address vrfCoordinatorV2,
      uint64 subscriptionId,
      bytes32 gasLane,
      uint256 mintFee,
      uint32 callbackGasLimit,
      string[3] memory dogTokenUris
   ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random IPFS NFT", "RIN"){
      i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
      i_gasLane = gasLane;
      i_subscriptionId = subscriptionId;
      i_mintFee = mintFee;
      i_callbackGasLimit = callbackGasLimit;
      s_tokenCounter = 0;
   }
}
