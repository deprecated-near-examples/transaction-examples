const nearAPI = require('near-api-js');

// converts NEAR amount into Yocto NEAR (10^−24)
// BigInt() allows JavaScript to handle these large numbers
function formatAmount(amount) {
  return BigInt(nearAPI
    .utils
    .format
    .parseNearAmount(amount.toString())
    );
};

module.exports = {
  formatAmount
};
