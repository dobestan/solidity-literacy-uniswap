// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;


import "./Exchange.sol";


contract Factory {
    event NewExchange(
        address indexed token,
        address indexed exchange
    );

    uint public tokenCount;

    mapping (address tokenAddress => address exchangeAddress) internal tokenToExchange;
    mapping (address exchangeAddress => address tokenAddress) internal exchangeToToken;
    mapping (uint256 exchangeId => address tokenAddress) internal idToToken;

    function createExchange(address tokenAddress) public returns (address exchangeAddress) {
        require(tokenAddress != address(0));
        require(tokenToExchange[tokenAddress] == address(0));

        Exchange exchange = new Exchange(tokenAddress);
        exchangeAddress = address(exchange);

        tokenToExchange[tokenAddress] = exchangeAddress;
        exchangeToToken[exchangeAddress] = tokenAddress;
        uint tokenId = tokenCount + 1;
        tokenCount = tokenId;
        idToToken[tokenId] = tokenAddress;

        emit NewExchange(tokenAddress, exchangeAddress);

        return address(exchange);
    }

    function getExchange(address tokenAddress) public view returns (address exchangeAddress) {
        exchangeAddress = tokenToExchange[tokenAddress];
        return exchangeAddress;
    }

    function getToken(address exchangeAddress) public view returns (address tokenAddress) {
        tokenAddress = exchangeToToken[exchangeAddress];
        return tokenAddress;
    }

    function getTokenWithId(uint256 tokenId) public view returns (address tokenAddress) {
        tokenAddress = idToToken[tokenId];
        return tokenAddress;
    }
}
