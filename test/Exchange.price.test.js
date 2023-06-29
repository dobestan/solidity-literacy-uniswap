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
        const ERC20 = await ethers.getContractFactory("ERC20Mintable");
        const token = await ERC20.deploy("Test Token", "TT");
        await token.deployed();

        const Exchange = await ethers.getContractFactory("Exchange");
        const exchange = await Exchange.deploy(token.address);
        await exchange.deployed();
        
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