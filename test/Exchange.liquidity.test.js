const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Exchange:LP Features", function () {
  let ERC20, token;
  let Exchange, exchange;
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();
  });

  beforeEach(async function () {
    ERC20 = await ethers.getContractFactory("ERC20Mintable");
    token = await ERC20.deploy("Test Token", "TT");
    token.deployed();

    const initialTokenAmount = ethers.utils.parseEther("100.0");
    await token.mint(owner.address, initialTokenAmount);

    Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy(token.address);
    exchange.deployed();  

    await token.connect(owner).approve(exchange.address, initialTokenAmount);

    // addLiquidity(1 Ether, 10 Tokens)
    // (X, Y) = (1 Ether: 10 Tokens)
    await exchange.connect(owner).addLiquidity(
      ethers.utils.parseEther("1.0"),
      ethers.utils.parseEther("10.0"),
      { value: ethers.utils.parseEther("1.0") }
    );
  });

  it("Should 'add liquidity' correctly when exchange is initialized", async function () {
    // LP Token should be 1
    expect(await exchange.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("1.0"));

    // Pool Reserve should be (1, 10)
    expect(await ethers.provider.getBalance(exchange.address)).to.equal(ethers.utils.parseEther("1.0"));
    expect(await token.balanceOf(exchange.address)).to.equal(ethers.utils.parseEther("10.0"));
  });
  it("Should 'add liquidity' correctly when exchange is already initialized", async function () {
    // addLiquidity(4 Ether, 40 Tokens)
    await exchange.connect(owner).addLiquidity(
      ethers.utils.parseEther("4.0"),
      ethers.utils.parseEther("40.0"),
      { value: ethers.utils.parseEther("4.0") }
    );

    // LP Token should be 5
    expect(await exchange.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("5.0"));

    // Pool Reserve should be (5, 50)
    expect(await ethers.provider.getBalance(exchange.address)).to.equal(ethers.utils.parseEther("5.0"));
    expect(await token.balanceOf(exchange.address)).to.equal(ethers.utils.parseEther("50.0"));
  });

  it("Should 'remove liquidity' correctly", async function () {    
    // Remove Liquidity (50%)
    // Liquidity: 1 Ether => 0.5 Ether
    const removeLiquidityAmount = ethers.utils.parseEther("1.0").div(2);
    await exchange.connect(owner).removeLiquidity(removeLiquidityAmount);

    // LP Token should be 0.5
    expect(await exchange.balanceOf(owner.address)).to.equal(removeLiquidityAmount);
    // Pool Reserve should be (0.5, 5)
    expect(await ethers.provider.getBalance(exchange.address)).to.equal(removeLiquidityAmount);
    expect(await token.balanceOf(exchange.address)).to.equal(ethers.utils.parseEther("5.0"));
  });
});