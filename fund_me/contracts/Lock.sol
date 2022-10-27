// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Fundme {
   
   uint256 public constant MINIMUM_USD = 50 * 10**18;
    address private immutable i_owner;
   address[] private s_funders;
   mapping(address => uint256) private s_addressToAmountFunded;
   AggregatorV3Interface private s_pricefeed;

   constructor(address priceFeedAddress){
      s_pricefeed = AggregatorV3Interface(priceFeedAddress);
      i_owner = msg.sender;
   }

   // function fund() public payable{
      
   // }
}
