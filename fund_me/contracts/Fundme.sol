// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error Fundme__NotOwner();

contract Fundme {
   using PriceConverter for uint256;

   uint256 public constant MINIMUM_USD = 50 * 10**18;
   address private immutable i_owner;
   address[] private s_funders;
   mapping(address => uint256) private s_addressToAmountFunded;
   AggregatorV3Interface private s_pricefeed;

   modifier onlyOwner(){
      if(msg.sender != i_owner)  revert Fundme__NotOwner();
      _;
   }

   constructor(address priceFeedAddress){
      s_pricefeed = AggregatorV3Interface(priceFeedAddress);
      i_owner = msg.sender;
   }

   function fund() public payable{
      require(
         msg.value.getConversionRate(s_pricefeed) >= MINIMUM_USD,
         "You need to spend more ETH"
      );
      s_addressToAmountFunded[msg.sender] += msg.value;
      s_funders.push(msg.sender); 
   }

   function withdraw() public onlyOwner{
      for(
         uint256 funderIndex = 0;
         funderIndex < s_funders.length;
         funderIndex++
      ){
         address funder = s_funders[funderIndex];
         s_addressToAmountFunded[funder] = 0;
      }
      (bool success,) = i_owner.call{value: address(this).balance}("");
      require(success);
   }
}
