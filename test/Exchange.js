const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Exchange", function () {
  let ERC20;
  let token;
  let Exchange;
  let exchange;

  before(async function () {
    ERC20 = await ethers.getContractFactory("ERC20");
    token = await ERC20.deploy("Test Token", "TT");
    await token.deployed();

    Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy(token.address);
    await exchange.deployed();
  });

  describe("Price Discovery Functions", function () {
    it("Should calculate 'input price' correctly", async function () {
      // (X, Y) = (100, 100)
      const inputAmount = ethers.utils.parseEther("1.0");
      const inputReserve = ethers.utils.parseEther("100.0");
      const outputReserve = ethers.utils.parseEther("100.0");

      const outputAmount = await exchange.getInputPrice(
        inputAmount,
        inputReserve,
        outputReserve
      );

      expect(outputAmount).to.equal(inputAmount.mul(997).div(1000));
    });

    it("Should calculate 'output price' correctly", async function () {
      // (X, Y) = (100, 100)
      const outputAmount = ethers.utils.parseEther("1.0");
      const inputReserve = ethers.utils.parseEther("100.0");
      const outputReserve = ethers.utils.parseEther("100.0");

      const inputAmount = await exchange.getOutputPrice(
        outputAmount,
        inputReserve,
        outputReserve
      );

      expect(inputAmount).to.equal(outputAmount.mul(1000).div(997));
    });
  });

  describe("Swap Features", function () {
  });

  describe("LP Features", function () {
  });
});