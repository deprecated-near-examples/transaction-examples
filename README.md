Constructing transactions on NEAR
===

This repository serves to demonstrate how transactions are created, signed, and sent to the NEAR blockchain. 

## Prerequisites:

- Current version of [Node.js](https://nodejs.org/). >=v14.0.0
- Private key of the sender's account
  - If the account was created using [near-cli](https://docs.near.org/docs/tools/near-cli) or you ran [near login](https://docs.near.org/docs/tools/near-cli#for-accounts) in your terminal, the private key can be found in a .json file located in /HOME/.near-credentials.
  - If the account was created using [NEAR Wallet](https://wallet.testnet.near.org/), the key can be found in the browser's Local Storage (in your browser's Developer tools... Application >> Storage >> Local Storage). Watch [this short video](https://youtu.be/rw2Tdc-7ccM) to learn how to get it.

## Setup:

1) Setup an environment variable `SENDER_PRIVATE_KEY` with the private key of the sender's account.

Either create a `.env` file in the root of this project, or export a bash variable by running the following in your terminal (replacing the example key).

```bash
export SENDER_PRIVATE_KEY=3wb4fVQvafPebkcCmyQPgMa2VsnX3JAQXZ4gjpc3kSu9AbVtLpLZqEog4xTbJrJxG1Y88SkHpuJV58GmPRnPXMD
```

2) Install dependencies by running:
```bash
npm i
```

## Examples:

### Send Tokens (High Level)
>[`send-tokens-easy.js`](./send-tokens-easy.js) will show you the easiest (JavaScript) way to send NEAR tokens (Ⓝ) using a [`near-api-js`](https://github.com/near/near-api-js) method; `account.sendMoney()`

1) In `send-tokens-easy.js`, update:
  - account IDs for `sender` and `receiver`.
  - network ID (`default` is `testnet`)

2) Run the file and send those tokens!

```bash
node send-tokens-easy.js
```

### Send Tokens (Low Level)
>[`send-tokens-deconstructed.js`](./send-tokens-deconstructed.js) completely dissects the transaction construction process and shows the lowest level way to send NEAR tokens (Ⓝ).

1) In `send-tokens-deconstructed.js`, update:
  - account IDs for `sender` and `receiver`.
  - network ID (`testnet` is default)
2) Enter the amount of Ⓝ you would like to send.
3) Run the file and send those tokens!
  
```bash
node send-tokens-deconstructed.js
```

For a detailed walk-through, see the [create-transactions](https://docs.near.org/docs/tutorials/create-transactions) doc.

Happy coding! 🚀 
