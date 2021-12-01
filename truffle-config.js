const { mnemonic, infuraID, bscscanAPI, etherscanAPI } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    eth: {
      provider: () => new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${infuraID}`),
      network_id: 1,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  compilers: {
   solc: {
        version: "^0.8.6",
        optimizer: {
            enabled: true,
            runs: 200,
        }
    }
  },
  api_keys: {
    bscscan: bscscanAPI,
    eterscan: etherscanAPI,
  },
  plugins: [
    'truffle-plugin-verify'
  ],

};
