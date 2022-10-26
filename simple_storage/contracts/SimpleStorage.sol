// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SimpleStorage {
   uint256 public favoriteNumber = 69;

   struct People {
      uint256 favoriteNumber;
      string name;
   }

   People[] public people;

   mapping(address => uint256) public currentFavoriteNumber;

   
}
