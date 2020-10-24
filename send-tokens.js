const nearAPI = require('near-api-js');
const sha256 = require('js-sha256');
const getConfig = require('./config');
const { formatAmount } = require('./utils');
//this is required if using a local .env file for private key
require('dotenv').config();

// configure accounts, network, and amount of NEAR to send
const sender = 'sender.testnet';
const receiver = 'receiver.testnet';
const config = getConfig('testnet');
const amount = formatAmount(1);

// sets up NEAR connection based on networkId
const provider = new nearAPI.providers.JsonRpcProvider(config.nodeUrl);

// creates keyPair used to sign transaction
const privateKey = process.env.SENDER_PRIVATE_KEY;
const keyPair = nearAPI.utils.key_pair.KeyPairEd25519.fromString(privateKey);

async function main() {
  console.log('Processing transaction...');

  // gets sender's public key
  const publicKey = keyPair.getPublicKey();

  // gets sender's public key information from NEAR blockchain 
  const accessKey = await provider.query(
    `access_key/${sender}/${publicKey.toString()}`, ''
    );

  // checks to make sure provided key is a full access key
  if(accessKey.permission !== 'FullAccess') {
      return console.log(
        `Account [ ${sender} ] does not have permission to send tokens using key: [ ${publicKey} ]`
        );
    };

  // each transaction requires a unique number or nonce
  // this is created by taking the current nonce and incrementing it
  const nonce = ++accessKey.nonce;

  // constructs actions that will be passed to the createTransaction method below
  const actions = [nearAPI.transactions.transfer(amount)];
  
  // converts a recent block hash into an array of bytes 
  // this hash was retrieved earlier when creating the accessKey (Line 26)
  // this is required to prove the tx was recently constructed (within 24hrs)
  const recentBlockHash = nearAPI.utils.serialize.base_decode(accessKey.block_hash);
 
  // create transaction
  const transaction = nearAPI.transactions.createTransaction(
    sender, 
    publicKey, 
    receiver, 
    nonce, 
    actions, 
    recentBlockHash
    );

  // before we can sign the transaction we must perform three steps...
  // 1) serialize the transaction in Borsh
  const serializedTx = nearAPI.utils.serialize.serialize(
    nearAPI.transactions.SCHEMA, 
    transaction
    );
  // 2) hash the serialized transaction using sha256
  const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx));
  // 3) create a signature using the hashed transaction
  const signature = keyPair.sign(serializedTxHash);

  // now we can sign the transaction :)
  const signedTransaction = new nearAPI.transactions.SignedTransaction({
    transaction,
    signature: new nearAPI.transactions.Signature({ 
      keyType: transaction.publicKey.keyType, 
      data: signature.signature 
    })
  });

  // send the transaction!
  try {
    // encodes signed transaction to serialized Borsh (required for all transactions)
    const signedSerialized = signedTransaction.encode();
    // sends transaction to NEAR blockchain via JSON RPC call and records the result
    const result = await provider.sendJsonRpc(
      'broadcast_tx_commit', 
      [Buffer.from(signedSerialized).toString('base64')]
      );
    // console results :)
    console.log('Transaction Results: ', result.transaction);
    console.log('--------------------------------------------------------------------------------------------')
    console.log('OPEN LINK BELOW to see transaction in NEAR Explorer!');
    console.log(`${config.explorerUrl}/transactions/${result.transaction.hash}`);
    console.log('--------------------------------------------------------------------------------------------');
  } catch (error) {
    console.log(error);
  };
};

// run the function
main();
