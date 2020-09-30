const nearAPI = require('near-api-js');
const BN = require('bn.js');
const getConfig = require('./config');

const keyStore = new nearAPI.keyStores.UnencryptedFileSystemKeyStore(`${process.env.HOME}/.near-credentials`);

function setupNear(env){
  const config = getConfig(env);

  return new nearAPI.Near({
    keyStore: keyStore,
    networkId: config.networkId,
    nodeUrl: config.nodeUrl,
    walletUrl: config.walletUrl,
    helperUrl: config.helperUrl,
    explorerUrl: config.explorerUrl,
  });  
};

function formatAmount(amount) {
  return new BN(nearAPI.utils.format.parseNearAmount(amount.toString()));
};

module.exports = {
  setupNear,
  formatAmount
};
