require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-docgen");


module.exports = {
    solidity: "0.8.20",
    networks: {
        goerli: {
            url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [
                `${process.env.PRIVATE_KEY}`,
            ],
        },
    },
    etherscan: {
        apiKey: `${process.env.ETHERSCAN_API_KEY}`
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    docgen: {
      path: './docs',
      clear: true,
    }
};
