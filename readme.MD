Constructing transactions on NEAR
===

This repository serves to demonstrate how transactions are created, signed, and sent to the NEAR blockchain. This example is shows a slightly lower level process than you would find on other [NEAR examples](https://near.dev).

Our main example we illustrate the process by sending NEAR tokens from one account to another. 

## Prerequisites:

- Make sure you have a current version of [Node.js](https://nodejs.org/) installed.
- You must have full access keys for the `sender` account stored locally in `/$HOME/.near-credentials`.
- If you created an account using [NEAR Wallet](https://wallet.testnet.near.org/), run the following command to store your keys locally.
```bash
near login
```

This command requires [`near-cli`](https://docs.near.org/docs/development/near-cli). You can install this by running:
```bash
npm install -g near-cli
```

## Setup:

1) Install dependencies by running:
```bash
npm i
```
2) Setup your network (`testnet` is default).
3) In `send-tokens.js`, update accountIds for `sender` and `receiver`.
4) Enter the amount of Ⓝ you would like to send. (Line 11).
5) Run the file and send those tokens!
```bash
node send-tokens.js
```
Happy coding! 🚀 
