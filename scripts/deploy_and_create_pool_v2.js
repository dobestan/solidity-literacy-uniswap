const { ethers, deployments } = require("hardhat");
const { utils } = require("ethers");


const UNISWAP_FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";


async function main() {
  const [deployer] = await ethers.getSigners();
  const { deploy } = deployments;

  console.log("Deploying contracts with the account:", deployer.address);

  const ERC20Mintable = await deploy("ERC20Mintable", {
    from: deployer.address,
    args: ["Literacy Meme Token", "LMT"],
    log: true,
  });

  console.log("ERC20Mintable deployed to:", ERC20Mintable.address);

  const token = await ethers.getContractAt("ERC20Mintable", ERC20Mintable.address);

  await token.mint(deployer.address, ethers.utils.parseEther("100000"));
  console.log("Minted 100,000 LMT tokens");

  const router = new ethers.Contract(
    UNISWAP_ROUTER_ADDRESS,
    [
      'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) payable external returns (uint amountToken, uint amountETH, uint liquidity)'
    ],
    deployer
  );

  const amountETHDesired = ethers.utils.parseEther("0.01");
  const amountTokenDesired = ethers.utils.parseEther("50000");
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  // Approve the Uniswap Router to spend the tokens
  await token.approve(UNISWAP_ROUTER_ADDRESS, amountTokenDesired);

  // Add liquidity
  await router.addLiquidityETH(
    token.address,
    amountTokenDesired,
    amountTokenDesired,
    amountETHDesired,
    deployer.address,
    deadline,
    {
        value: amountETHDesired,
        gasLimit: 10000000,
    },
  );

  console.log("Added liquidity to Uniswap V2");
  console.log("https://app.uniswap.org/#/swap?use=V2");
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
