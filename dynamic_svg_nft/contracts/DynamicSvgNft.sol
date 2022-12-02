// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

contract DynamicSvgNft is ERC721, Ownable {
   uint256 private s_tokenCounter;
   string private s_lowImageURI;
   string private s_highImageURI;

   mapping(uint256 => int256) private s_tokenIdToHighValues;
   AggregatorV3Interface internal immutable i_priceFeed;
   event CreatedNFT(uint256 indexed tokenId, int256 highValue);

   constructor(
      address priceFeedAddress,
      string memory lowSvg,
      string memory highSvg
   ) ERC721("Dynamic SVG NFT", "DSN"){
      s_tokenCounter = 0;
      i_priceFeed = AggregatorV3Interface(priceFeedAddress);

   }

   function svgToImageURI(string memory svg) public pure returns (string memory) {
      string memory baseURL = "data:image/svg+xlm;base64";
      string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
      return string(abi.encodePacked(baseURL, svgBase64Encoded));
   }

}