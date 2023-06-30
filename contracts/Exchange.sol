// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Exchange is ERC20 {
    address public tokenAddress;

    event TokenPurchase(address indexed buyer, uint256 indexed etherSold, uint256 indexed tokensBought);
    event EtherPurchase(address indexed buyer, uint256 indexed tokensSold, uint256 indexed etherBought);
    event AddLiquidity(address indexed provider, uint256 indexed etherAmount, uint256 indexed tokenAmount);
    event RemoveLiquidity(address indexed provider, uint256 indexed etherAmount, uint256 indexed tokenAmount);


    constructor(
        address _tokenAddress
    ) ERC20("Uniswap V1", "UNI-V1") {
        tokenAddress = _tokenAddress;
    }

    function addLiquidity(
        uint minLpTokenAmount,
        uint maxTokenAmount
    ) public payable returns (uint lpTokenAmount) {
        ERC20 token = ERC20(tokenAddress);
        uint totalLiquidity = totalSupply();

        if (totalLiquidity == 0) {
            // Initial Liquidity: (msg.value, maxTokenAmount)
            uint etherAmount = msg.value;
            uint tokenAmount = maxTokenAmount;
            lpTokenAmount = etherAmount;
            token.transferFrom(msg.sender, address(this), tokenAmount);

            _mint(msg.sender, lpTokenAmount);
            emit AddLiquidity(msg.sender, etherAmount, tokenAmount);
            
            return lpTokenAmount;
        } else {
            // Liquidity Exists: (etherReserve, tokenReserve)
            uint etherReserve = address(this).balance - msg.value;
            uint tokenReserve = token.balanceOf(address(this));
            
            // (Share) = msg.value / etherReserve
            lpTokenAmount = totalLiquidity * msg.value / etherReserve;
            uint tokenAmount = tokenReserve * msg.value / etherReserve;
            
            require(lpTokenAmount >= minLpTokenAmount);
            require(maxTokenAmount >= tokenAmount);

            token.transferFrom(msg.sender, address(this), tokenAmount);

            _mint(msg.sender, lpTokenAmount);
            emit AddLiquidity(msg.sender, msg.value, tokenAmount);

            return lpTokenAmount;
        }
    }

    function removeLiquidity(
        uint lpTokenAmount
    ) public returns (uint etherAmount, uint tokenAmount) {
        // Implemented in removing liquidity with fair share of Ether and Tokens.
        uint totalLiquidity = totalSupply();
        ERC20 token = ERC20(tokenAddress);
        etherAmount = address(this).balance * lpTokenAmount / totalLiquidity;
        tokenAmount = token.balanceOf(address(this)) * lpTokenAmount / totalLiquidity;

        _burn(msg.sender, lpTokenAmount);
        payable(msg.sender).transfer(etherAmount);
        token.transfer(msg.sender, tokenAmount);
        
        emit RemoveLiquidity(msg.sender, etherAmount, tokenAmount);

        return (etherAmount, tokenAmount);
    }

    function getInputPrice(
        uint inputAmount,
        uint inputReserve,
        uint outputReserve
    ) public pure returns (uint outputAmount) {
        uint numerator = inputAmount * outputReserve;
        uint denominator = inputAmount + inputReserve;
        uint outputAmountWithFee = numerator / denominator;
        outputAmount = outputAmountWithFee * 967 / 1000;
    }

    function getOutputPrice(
        uint outputAmount,
        uint inputReserve,
        uint outputReserve
    ) public pure returns (uint inputAmount) {
        uint numerator = inputReserve * outputAmount;
        uint denominator = outputReserve - outputAmount;
        uint inputAmountWithoutFee = numerator / denominator;
        inputAmount = inputAmountWithoutFee * 1000 / 967;
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

        // Events
        emit TokenPurchase(msg.sender, etherSold, tokensBought);

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

        // Events
        emit TokenPurchase(msg.sender, etherSold, tokensBought);

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

        // Events
        emit EtherPurchase(msg.sender, tokensSold, etherBought);

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

        // Events
        emit EtherPurchase(msg.sender, tokensSold, etherBought);

        return tokensSold;
    }
}