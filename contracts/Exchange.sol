// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Exchange is ERC20 {
    address public tokenAddress;

    constructor(
        address _tokenAddress
    ) ERC20("Uniswap V1", "UNI-V1") {
        tokenAddress = _tokenAddress;
    }

    function addLiquidity(
    ) public payable returns (uint lpTokenAmount) {
    }

    function removeLiquidity(
        uint lpTokenAmount
    ) public returns (uint etherAmount, uint TokenAmount) {
    }

    function getInputPrice(
        uint inputAmount,
        uint inputReserve,
        uint outputReserve
    ) public pure returns (uint outputAmount) {
        outputAmount = inputAmount * 997 / 1000;
        // Implemented in CSMM Price Discovery Method.
        // #TODO: Should change to CPMM.
    }

    function etherToTokenInput(
        uint minTokens
    ) public payable returns (uint tokensBought) {
        uint etherSold = msg.value;
        ERC20 token = ERC20(tokenAddress);
        tokensBought = getInputPrice(
            etherSold, 
            address(this).balance - msg.value,
            token.balanceOf(address(this))
        );
        token.transfer(msg.sender, tokensBought);

        require(tokensBought >= minTokens);
        return tokensBought;
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