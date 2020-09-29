const HOME_DIR = require('os').homedir();
const nearAPI = require('near-api-js');
//create keyStore based on keys stored in ~/.near-credentials
const keyStore = new nearAPI.keyStores.UnencryptedFileSystemKeyStore(`${HOME_DIR}/.near-credentials`);

function getConfig (env) {
  switch (env) {
    case 'mainnet':{
      config = new nearAPI.Near({
        keyStore: keyStore,
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org'
      });
      return config;
    };
    // This is an example app so production is set to testnet.
    // You can move production to mainnet if that is applicable.
    case 'production':
    case 'development':
    case 'testnet':{
        config = new nearAPI.Near({
          keyStore: keyStore,
          networkId: 'default',
          nodeUrl: 'https://rpc.testnet.near.org',
          walletUrl: 'https://wallet.testnet.near.org',
          helperUrl: 'https://helper.testnet.near.org'
        })
        return config;
      };
    case 'betanet':{
        config = new nearAPI.Near({
          keyStore: keyStore,
          networkId: 'betanet',
          nodeUrl: 'https://rpc.betanet.near.org',
          walletUrl: 'https://wallet.betanet.near.org',
          helperUrl: 'https://helper.betanet.near.org'
        });
        return config;        
      };
    case 'local':{
      config = new nearAPI.Near({
        keyStore: keyStore,
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet',      
      });
      return config;
    };
    case 'test':
    case 'ci':{
      config = new nearAPI.near({
        keyStore: keyStore,
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        masterAccount: 'test.near'
      });
      return config;
      };
    default:
      throw Error(`Unconfigured environment '${env}'. Please configure in /config.js.`)
  };
};

module.exports = getConfig;
