// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract SimpleStorage {
   uint256 private favoriteNumber = 69;

   struct People {
      uint256 favoriteNumber;
      address user;
   }

   People[] public people;

   mapping(address => uint256) public currentFavoriteNumber;

   function addAnotherFavoriteNumber(uint256 _favoriteNumber) public{
      // console.log("Setting current number to %s", _favoriteNumber);
      people.push(People(_favoriteNumber, msg.sender));
      currentFavoriteNumber[msg.sender] = _favoriteNumber;
      favoriteNumber = _favoriteNumber;
   }

   function retrieve() public view returns(uint256){
      return favoriteNumber;
   }
}
