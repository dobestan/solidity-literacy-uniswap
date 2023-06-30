module.exports = async ({ getNamedAccounts, deployments, ethers }) => {
    console.log(`
============================================================
                    *** Deploying ***

   / /   (_) /____  _________ ________  __
  / /   / / __/ _ \/ ___/ __ '/ ___/ / / /
 / /___/ / /_/  __/ /  / /_/ / /__/ /_/ /
/_____/_/\__/\___/_/   \__,_/\___/\__, /   ... is love ❤️
                                 /____/
============================================================
`)

  const { deploy, getOrNull, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  const ERC20Mintable = await deploy("ERC20Mintable", {
    from: deployer,
    args: ["Solidity Literacy Token", "SLT"],
    log: true,
  });

  const existingToken = await getOrNull("ERC20Mintable");
  if (!existingToken) {
    await execute(
      "ERC20Mintable",
      { from: deployer },
      "mint",
      deployer,
      ethers.utils.parseEther("10000")
    );
    console.log("Minted 10000 tokens to deployer");
  } else {
    console.log("ERC20Mintable already deployed, skipping minting");
  }
};


module.exports.tags = ["ERC20Mintable"];
