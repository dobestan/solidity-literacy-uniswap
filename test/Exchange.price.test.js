const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Exchange:Price Discovery Functions", function () {
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();
  });

    it("Should calculate 'input price' correctly", async function () {
      const ERC20 = await ethers.getContractFactory("ERC20Mintable");
      const token = await ERC20.deploy("Test Token", "TT");
      await token.deployed();

      const Exchange = await ethers.getContractFactory("Exchange");
      const exchange = await Exchange.deploy(token.address);
      await exchange.deployed();
      
      // (X, Y) = (100, 400)
      const inputAmount = ethers.utils.parseEther("100.0");  // Changed inputAmount to 100
      const inputReserve = ethers.utils.parseEther("100.0");
      const outputReserve = ethers.utils.parseEther("400.0");  // Changed outputReserve to 400

      const outputAmount = await exchange.getInputPrice(
        inputAmount,
        inputReserve,
        outputReserve
      );

      const expectedOutput = inputAmount.mul(outputReserve).div(inputAmount.add(inputReserve)).mul(967).div(1000);
      expect(outputAmount).to.equal(expectedOutput);
    });

    it("Should calculate 'output price' correctly", async function () {
      const ERC20 = await ethers.getContractFactory("ERC20Mintable");
      const token = await ERC20.deploy("Test Token", "TT");
      await token.deployed();

      const Exchange = await ethers.getContractFactory("Exchange");
      const exchange = await Exchange.deploy(token.address);
      await exchange.deployed();
      
      const outputAmount = ethers.utils.parseEther("100.0"); 
      const inputReserve = ethers.utils.parseEther("100.0");
      const outputReserve = ethers.utils.parseEther("400.0");

      const inputAmount = await exchange.getOutputPrice(
        outputAmount,
        inputReserve,
        outputReserve
      );

      const expectedInput = outputAmount.mul(inputReserve).div(outputReserve.sub(outputAmount)).mul(1000).div(967);
      expect(inputAmount).to.equal(expectedInput);
    });
});