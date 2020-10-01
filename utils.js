const nearAPI = require('near-api-js');
const getConfig = require('./config');

// create a keyStore to sign transactions
const keyStore = new nearAPI.keyStores.UnencryptedFileSystemKeyStore(
  `${process.env.HOME}/.near-credentials`
  );

// constructs an object that will allow connection
// and interaction with the NEAR blockchain
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

// converts amount into Yacto Near (10^−24)
// BigInt() allows JavaScript to handle these large numbers
function formatAmount(amount) {
  return BigInt(nearAPI.utils.format.parseNearAmount(amount.toString()));
};

module.exports = {
  setupNear,
  formatAmount
};
