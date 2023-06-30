// deploy/02_create_exchange.js
module.exports = async ({ getNamedAccounts, deployments, ethers }) => {
  const { execute, get, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const ERC20Mintable = await get("ERC20Mintable");
  const Factory = await get("Factory");

  const existingExchange = await read("Factory", "getExchange", ERC20Mintable.address);

  let exchangeAddress;
  if (existingExchange === "0x0000000000000000000000000000000000000000") {
    const { transactionHash } = await execute(
      "Factory",
      { from: deployer },
      "createExchange",
      ERC20Mintable.address
    );
  } else {
    console.log("Exchange already exists for ERC20Mintable, skipping creation");
  }

  console.log("=====================");
  console.log(" Deployment Summary:");
  console.log("=====================");
  console.log("Token Address:", ERC20Mintable.address);
  console.log("Factory Address:", Factory.address);
};

module.exports.tags = ["CreateExchange"];
