Constructing transactions on NEAR
===

This repository serves to demonstrate how transactions are created, signed, and sent to the NEAR blockchain. 

For this example, we will show you how to construct a transaction that will send NEAR tokens from one account to another. 

**Note**: This example shows a lower level process than you would  normally find on other [NEAR examples](https://near.dev).

## Prerequisites:

- Current version of [Node.js](https://nodejs.org/). >=v14.0.0

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

3) In `send-tokens.js`, update:
  - account IDs for `sender` and `receiver`.
  - network ID (`testnet` is default)
4) Enter the amount of Ⓝ you would like to send. (Line 10).
5) Run the file and send those tokens!
```bash
node send-tokens.js
```
Happy coding! 🚀 
