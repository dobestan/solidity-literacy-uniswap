// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Exchange is ERC20 {
    constructor() ERC20("Uniswap V1", "UNI-V1") {}

    function addLiquidity(
    ) public payable returns (uint lpTokenAmount) {
    }

    function removeLiquidity(
        uint lpTokenAmount
    ) public returns (uint etherAmount, uint TokenAmount) {
    }

    function etherToTokenInput(
        uint minTokens
    ) public payable returns (uint tokensBought) {
    }

    function etherToTokenOutput(
        uint tokensBought,
        uint maxEther
    ) public payable returns (uint etherSold) {
    }

    function tokenToEtherInput(
        uint tokensSold,
        uint minEther
    ) public returns (uint etherBought) {
    }

    function tokenToEtherOutput(
        uint etherBought,
        uint maxTokens
    ) public returns (uint tokensSold) {
    }
}