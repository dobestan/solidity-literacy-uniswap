const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Exchange:LP Features", function () {
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();
  });

  it("Should 'add liquidity' correctly", async function () {
      const ERC20 = await ethers.getContractFactory("ERC20Mintable");
    const token = await ERC20.deploy("Test Token", "TT");
    await token.deployed();

    const Exchange = await ethers.getContractFactory("Exchange");
    const exchange = await Exchange.deploy(token.address);
    await exchange.deployed();
    
    const initialTokenAmount = ethers.utils.parseEther("100.0");
    await token.mint(owner.address, initialTokenAmount);
    await token.connect(owner).approve(exchange.address, initialTokenAmount);

    // addLiquidity(1 Ether)
    const liquidityAmount = ethers.utils.parseEther("1.0");
    await exchange.connect(owner).addLiquidity({ value: liquidityAmount });

    // tokenAmount
    const finalTokenBalance = await token.balanceOf(owner.address);
    const expectedTokenBalance = initialTokenAmount.sub(liquidityAmount);
    expect(finalTokenBalance).to.equal(expectedTokenBalance);
  
    // lpTokenAmount
    const lpTokenBalance = await exchange.balanceOf(owner.address);
    expect(lpTokenBalance).to.equal(liquidityAmount);
  });

  it("Should 'remove liquidity' correctly", async function () {
    const ERC20 = await ethers.getContractFactory("ERC20Mintable");
    const token = await ERC20.deploy("Test Token", "TT");
    await token.deployed();

    const Exchange = await ethers.getContractFactory("Exchange");
    const exchange = await Exchange.deploy(token.address);
    await exchange.deployed();
    
    // Add Liquidity(1 Ether)
    const initialTokenAmount = ethers.utils.parseEther("100.0");
    await token.mint(owner.address, initialTokenAmount);
    await token.connect(owner).approve(exchange.address, initialTokenAmount);
    const liquidityAmount = ethers.utils.parseEther("1.0");
    await exchange.connect(owner).addLiquidity({ value: liquidityAmount });

    // Remove Liquidity (50%)
    // Liquidity: 1 Ether => 0.5 Ether
    const removeLiquidityAmount = liquidityAmount.div(2);
    await exchange.connect(owner).removeLiquidity(removeLiquidityAmount);

    // lpTokenAmount
    const finalLpTokenBalance = await exchange.balanceOf(owner.address);
    const expectedLpTokenBalance = liquidityAmount.sub(removeLiquidityAmount);
    expect(finalLpTokenBalance).to.equal(expectedLpTokenBalance);

    // tokenAmount
    const finalTokenBalance = await token.balanceOf(owner.address);
    expect(finalTokenBalance).to.be.at.least(removeLiquidityAmount);

    // Ether balance
    const finalEtherBalance = await owner.getBalance();
    expect(finalEtherBalance).to.be.at.least(removeLiquidityAmount);
  });
});