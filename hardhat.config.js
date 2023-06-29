require("@nomicfoundation/hardhat-toolbox");


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
};
