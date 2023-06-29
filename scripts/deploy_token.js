const hre = require("hardhat");


async function main() {
    const name = "TestToken";
    const symbol = "TT";

    const Token = await hre.ethers.getContractFactory("ERC20");
    console.log(`Deploying ${name}\(\$${symbol}\)...`);
    const token = await Token.deploy(name, symbol);
    await token.deployed();

    console.log(`${name} deployed to:`, token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
