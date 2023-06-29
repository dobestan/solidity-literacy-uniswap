const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Exchange:Swap Features", function () {
  let owner;
  let user1, user2;
  let token, exchange;

  before(async function () {
    [owner, user1, user2] = await ethers.getSigners();
  });

  beforeEach(async function () {
    // Deploy ERC20 token and initialize balances for liquidity provision
    const ERC20 = await ethers.getContractFactory("ERC20Mintable");
    token = await ERC20.deploy("Test Token", "TT");
    await token.deployed();
    
    // Mint initial balances to user1 and user2
    await token.mint(user1.address, ethers.utils.parseEther("50"));
    await token.mint(user2.address, ethers.utils.parseEther("50"));

    // Deploy Exchange
    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy(token.address);
    await exchange.deployed();

    // Approve transfer of token for exchange
    await token.connect(user1).approve(exchange.address, ethers.utils.parseEther("50"));
    await token.connect(user2).approve(exchange.address, ethers.utils.parseEther("50"));

    // Provide initial liquidity
    await exchange.connect(user1).addLiquidity({ value: ethers.utils.parseEther("50") });
    await exchange.connect(user2).addLiquidity({ value: ethers.utils.parseEther("50") });
  });

  describe("etherToTokenInput", function () {
    it("should correctly calculate the token output amount given an Ether input", async function () {
        const etherInput = ethers.utils.parseEther("5");
        const initialTokenBalance = await token.balanceOf(user1.address);

        const expectedTokenOutput = etherInput.mul(967).div(1000);

        await exchange.connect(user1).etherToTokenInput(expectedTokenOutput, { value: etherInput });

        const finalTokenBalance = await token.balanceOf(user1.address);
        const actualTokenOutput = finalTokenBalance.sub(initialTokenBalance);

        // Considering 5% of Price Impact
        expect(actualTokenOutput).to.be.at.least(expectedTokenOutput.mul(95).div(100));
    });

    it("should revert if the Ether input is less than the minimum specified", async function () {
    });
  });

  describe("etherToTokenOutput", function () {
    it("should correctly calculate the Ether input amount given a token output", async function () {
    });

    it("should revert if the token output is more than the maximum specified", async function () {
    });
  });

  describe("tokenToEtherInput", function () {
    it("should correctly calculate the Ether output amount given a token input", async function () {
    });

    it("should revert if the token input is less than the minimum specified", async function () {
    });
  });

  describe("tokenToEtherOutput", function () {
    it("should correctly calculate the token input amount given an Ether output", async function () {
    });

    it("should revert if the Ether output is more than the maximum specified", async function () {
    });
  });
});
