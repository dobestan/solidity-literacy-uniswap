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

    function getOutputPrice(
        uint outputAmount,
        uint inputReserve,
        uint outputReserve
    ) public pure returns (uint inputAmount) {
        inputAmount = outputAmount * 1000 / 997;
        // Implemented in CSMM Price Discovery Method.
        // #TODO: Should change to CPMM.
    }

    function etherToTokenInput(
        uint minTokens
    ) public payable returns (uint tokensBought) {
        // Price Discovery
        uint etherSold = msg.value;
        ERC20 token = ERC20(tokenAddress);
        tokensBought = getInputPrice(
            etherSold, 
            address(this).balance - msg.value,
            token.balanceOf(address(this))
        );

        // Validity
        require(tokensBought >= minTokens);
        
        // Transfer
        token.transfer(msg.sender, tokensBought);

        return tokensBought;
    }

    function etherToTokenOutput(
        uint tokensBought,
        uint maxEther
    ) public payable returns (uint etherSold) {
        // Price Discovery
        ERC20 token = ERC20(tokenAddress);
        etherSold = getOutputPrice(
            tokensBought,
            address(this).balance - msg.value,
            token.balanceOf(address(this))
        );

        // Validity Check
        require(msg.value >= etherSold);
        require(maxEther >= etherSold);

        // Refund
        uint etherRefundAmount = msg.value - etherSold;
        if (etherRefundAmount > 0) {
            payable(msg.sender).transfer(etherRefundAmount);
        }

        // Transfer
        token.transfer(msg.sender, tokensBought);
        return etherSold;
    }

    function tokenToEtherInput(
        uint tokensSold,
        uint minEther
    ) public returns (uint etherBought) {
        // Price Discovery
        ERC20 token = ERC20(tokenAddress);
        etherBought = getInputPrice(
            tokensSold,
            token.balanceOf(address(this)),
            address(this).balance
        );

        // Validity Check
        require(etherBought >= minEther);

        // Transfer
        token.transferFrom(msg.sender, address(this), tokensSold);
        payable(msg.sender).transfer(etherBought);

        return etherBought;
    }

    function tokenToEtherOutput(
        uint etherBought,
        uint maxTokens
    ) public returns (uint tokensSold) {
        // Price Discovery
        ERC20 token = ERC20(tokenAddress);
        tokensSold = getOutputPrice(
            etherBought,
            token.balanceOf(address(this)),
            address(this).balance
        );

        // Validity Check
        require(maxTokens >= tokensSold);

        // Transfer
        token.transferFrom(msg.sender, address(this), tokensSold);
        payable(msg.sender).transfer(etherBought);

        return tokensSold;
    }
}