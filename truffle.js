module.exports = {
  networks: {
    ropsten: {
      provider: () => {
        return require("@daonomic/trezor-web3-provider")("https://api.myetherapi.com/rop", "m/44'/1'/0'/4/0");
      },
      network_id: 3,
      from: "0x9aa2811e605496c18dccf8ef6b1da8d7eb8dabe4",
      gas: 3500000,
	    gasPrice: 3000000000
    },
    mainnet: {
      provider: () => {
        return require("@daonomic/trezor-web3-provider")("http://ether:8545", "m/44'/1'/0'/4/1");
      },
      network_id: 1,
//      from: "0x2b5cb0d75bc06e58630c9a79ccf4beafec36e19a",
      gas: 100000,
	    gasPrice: 1000000000
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};