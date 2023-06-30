module.exports = async ({ getNamedAccounts, deployments, ethers }) => {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  const ERC20Mintable = await deploy("ERC20Mintable", {
    from: deployer,
    args: ["Solidity Literacy Token", "SLT"],
    log: true,
  });

  await execute(
    "ERC20Mintable",
    { from: deployer },
    "mint",
    deployer,
    ethers.utils.parseEther("10000")
  );

  console.log("Minted 10000 tokens to deployer");
};

module.exports.tags = ["ERC20Mintable"];
