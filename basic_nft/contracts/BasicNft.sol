// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BasicNft is ERC721 {
   string public constant TOKEN_URI = "https://ipfs.io/ipfs/QmSsYRx3LpDAb1GZQm7zZ1AuHZjfbPkD6J7s9r41xu1mf8?filename=pug.png";
   uint256 private s_tokenCounter;

   constructor() ERC721("Dogie", "DOG"){
      s_tokenCounter = 0;
   }

   function mintNft() public {
      s_tokenCounter = s_tokenCounter + 1;
      _safeMint(msg.sender, s_tokenCounter);
   }

   function tokenURI(uint256 tokenId) public pure override returns (string memory){
      return TOKEN_URI;
   }

   function getTokenCounter() public view returns (uint256){
      return s_tokenCounter;
   }
}
