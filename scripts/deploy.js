const hre = require("hardhat");


const TOKEN_NAMES = ["Dog", "Cat", "Lion", "Elephant", "Rabbit"];


async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    const Token = await ethers.getContractFactory("ERC20");
    const Factory = await ethers.getContractFactory("Factory");

    // Deploy Factory
    const factory = await Factory.deploy();
    await factory.deployed();
    console.log("Factory deployed to:", factory.address);

    // Deploy Tokens and Exchanges
    for (let i = 0; i < TOKEN_NAMES.length; i++) {
        let tokenName = TOKEN_NAMES[i];
        let tokenSymbol = tokenName.toUpperCase();
        
        // Deploy ERC20 Token
        const token = await Token.deploy(tokenName, tokenSymbol);
        await token.deployed();
        console.log(`${tokenName} Token deployed to:`, token.address);
        
        // Create Exchange
        await factory.createExchange(token.address);
        const exchangeAddress = await factory.getExchange(token.address);
        console.log(`Exchange for ${tokenName} created at:`, exchangeAddress);
    }
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
