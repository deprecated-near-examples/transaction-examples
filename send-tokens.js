const api = require('near-api-js');
const { setupNear, formatAmount } = require('./utils');
const { transactions, utils } = api;

// configure your network
const near = setupNear('testnet');

// configure accounts and amount of NEAR to send
const sender = 'nearkat.testnet';
const receiver = 'joshford.testnet';
const amount = formatAmount(1);
const networkId = near.config.networkId;

async function main() {
  console.log('Processing transaction...')

  // get sender's public key
  const publicKey = await near.connection.signer.getPublicKey(sender, networkId);

  // throw error to console if publicKey is not found in /HOME/.near-credentials
  if(!publicKey || publicKey === null) {
    return console.log(`ERROR: Key not found for sender account: [ ${sender} ]`);
  };

  // gets key information from blockchain using sender's public key
  const accessKey = await near.connection.provider.query(`access_key/${sender}/${publicKey.toString()}`, '');

  // return error to console if key is not a full access key
  if(accessKey.permission !== 'FullAccess') {
      return console.log(`Account [ ${sender} ] does not have permission to send tokens using key: [ ${publicKey} ]`);
    };

  // gets current nonce from the key and adds 1 to create a nonce for this transaction
  // each time the key is used in a transaction, the nonce is incremented by 1
  const nonce = ++accessKey.nonce;

  // constructs actions that will be passed to the createTransaction method below
  const actions = [transactions.transfer(amount)];
  
  // create transaction
  const tx = transactions.createTransaction(
    sender, 
    publicKey, 
    receiver, 
    nonce, 
    actions, 
    utils.serialize.base_decode(accessKey.block_hash)
    );
  // **NOTE** the last argument passed is a current block hash we received when declaring 
  // the accessKey variable on line 26. We pass this particular argument to prove that 
  // the transaction was constructed recently. (within last 12 hrs)

  // sign transaction
  const [txHash, signedTx] = await transactions.signTransaction(
    tx, 
    near.connection.signer, 
    sender, 
    networkId
    );

  // send transaction!
  try {
    // encodes transaction to serialized BORSH (required for all transactions)
    const bytes = signedTx.encode();
    // sends transaction to NEAR blockchain via JSON RPC call and records the result
    const result = await near.connection.provider.sendJsonRpc(
      'broadcast_tx_commit', 
      [Buffer.from(bytes).toString('base64')]
      );
    // console results :)
    console.log('Transaction Results: ', result.transaction);
    console.log('--------------------------------------------------------------------------------------------')
    console.log('OPEN LINK BELOW to see transaction in NEAR Explorer!');
    console.log(`https://explorer.testnet.near.org/transactions/${result.transaction.hash}`);
    console.log('--------------------------------------------------------------------------------------------')
  } catch (error) {
    console.log(error);
  };
};

// run the function
main();
