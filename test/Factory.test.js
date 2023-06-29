const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Factory", function () {
  let Factory, factory;
  let ERC20, token;
  let owner, addr1, addr2;
  
  beforeEach(async () => {
    Factory = await ethers.getContractFactory("Factory");
    factory = await Factory.deploy();

    ERC20 = await ethers.getContractFactory("ERC20");
    token = await ERC20.deploy("TestToken", "TT");
    
    [owner, addr1, addr2] = await ethers.getSigners();
  });
  
  describe("createExchange", function () {
    it("should correctly map tokenToExchange and exchangeToToken", async function () {
      const transaction = await factory.createExchange(token.address);
      const receipt = await transaction.wait();
      const exchangeAddress = receipt.events[0].args[1];

      const tokenAddressFromExchange = await factory.getToken(exchangeAddress);
      const exchangeAddressFromToken = await factory.getExchange(token.address);

      expect(tokenAddressFromExchange).to.equal(token.address);
      expect(exchangeAddressFromToken).to.equal(exchangeAddress);
    });

    it("should correctly create a new exchange", async function () {
      const transaction = await factory.createExchange(token.address);
      const receipt = await transaction.wait();
      const exchangeAddress = receipt.events[0].args[1];
      const createdExchangeAddress = await factory.getExchange(token.address);
      expect(exchangeAddress).to.equal(createdExchangeAddress);
    });

    it("should fail if exchange already exists for a token", async function () {
      await factory.createExchange(token.address);
      await expect(factory.createExchange(token.address)).to.be.reverted;
    });
  });
});
