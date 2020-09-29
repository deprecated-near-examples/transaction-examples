const BN = require('bn.js');
const nearAPI = require('near-api-js');

function formatAmount(amount) {
  return new BN(nearAPI.utils.format.parseNearAmount(amount.toString()));
};

module.exports = {
  formatAmount,
};