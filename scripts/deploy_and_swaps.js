const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const MAX_UINT256 = ethers.constants.MaxUint256;

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy ERC20Mintable
  const ERC20Mintable = await ethers.getContractFactory("ERC20Mintable");
  const erc20Mintable = await ERC20Mintable.deploy("Solidity Literacy Token", "SLT");
  await erc20Mintable.deployed();
  console.log("ERC20Mintable contract address:", erc20Mintable.address);

  // Mint 10000 tokens
  await erc20Mintable.mint(deployer.address, ethers.utils.parseEther('10000'), { gasLimit: 1000000 });
  console.log("Minted 10000 SLT tokens");

  // Deploy Factory
  const Factory = await ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();
  await factory.deployed();
  console.log("Factory contract address:", factory.address);

  // Create (Ether, SLT) exchange
  const createExchangeTx = await factory.createExchange(erc20Mintable.address);
  const receipt = await createExchangeTx.wait();

  const exchangeAddress = await factory.getExchange(erc20Mintable.address);
  console.log("(Ether, SLT) exchange address:", exchangeAddress);

  // Add liquidity
  const Exchange = await ethers.getContractAt("Exchange", exchangeAddress);
  const approveTx = await erc20Mintable.approve(exchangeAddress, MAX_UINT256);
  await approveTx.wait();

  const addLiquidityTx = await Exchange.addLiquidity(
    ethers.utils.parseEther('5000'),
    ethers.utils.parseEther('5000'),
    {
        value: ethers.utils.parseEther('0.01'),
    }
  );
  await addLiquidityTx.wait();
  console.log("Added liquidity to the exchange");

  // Perform swaps
  for(let i = 0; i < 3; i++) {
    // Swap Ether to Token
    await Exchange.etherToTokenInput(ethers.utils.parseEther('0.001'), { value: ethers.utils.parseEther('0.001')});
    console.log("Swapped ETH for SLT");

    // Swap Token to Ether
    await Exchange.tokenToEtherInput(ethers.utils.parseEther('500'), 0);
    console.log("Swapped SLT for ETH");
  }
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
