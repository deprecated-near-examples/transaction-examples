const nearAPI = require('near-api-js');
const sha256 = require('js-sha256');
const { setupNear, formatAmount } = require('./utils');

// configure your network
const near = setupNear('testnet');
const privateKey = process.env.NEARKAT_PRIVATE_KEY
const keyPair = nearAPI.utils.key_pair.KeyPairEd25519.fromString(privateKey)

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
  const actions = [nearAPI.transactions.transfer(amount)];
  
  // converts a recent block hash into an array of bytes 
  // this hash was retrieved earlier when creating the accessKey (Line 25)
  // this is required to prove the tx was recently constructed (within 12hrs)
  const recentBlockHash = nearAPI.utils.serialize.base_decode(accessKey.block_hash)
 
  // create transaction
  const transaction = nearAPI.transactions.createTransaction(
    sender, 
    publicKey, 
    receiver, 
    nonce, 
    actions, 
    recentBlockHash
    );

  // Before we can sign the transaction we must perform three steps
  // 1) Serialize the transaction in BORSH
  const serializedTx = nearAPI.utils.serialize.serialize(
    nearAPI.transactions.SCHEMA, 
    transaction
    );
  // 2) Hash the serialized transaction using sha256
  const hashedTx = new Uint8Array(sha256.sha256.array(serializedTx));
  // 3) Create a unique signature using the hashed transaction
  const signature = keyPair.sign(hashedTx);
  
  // Now we can sign the transaction :)
  const signedTransaction = new nearAPI.transactions.SignedTransaction({
    transaction,
    signature: new nearAPI.transactions.Signature({ 
      keyType: transaction.publicKey.keyType, 
      data: signature.signature 
    })
  });

  // send transaction!
  try {
    // encodes signed transaction to serialized BORSH (required for all transactions)
    const bytes = signedTransaction.encode();
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
