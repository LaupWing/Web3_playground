// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SimpleStorage {
   uint256 public favoriteNumber = 69;

   struct People {
      uint256 favoriteNumber;
      address user;
   }

   People[] public people;

   mapping(address => uint256) public currentFavoriteNumber;

   function addAnotherFavoriteNumber(uint256 _favoriteNumber) public{
      people.push(People(_favoriteNumber, msg.sender));
      currentFavoriteNumber[msg.sender] = _favoriteNumber;
      favoriteNumber = _favoriteNumber;
   }
}
