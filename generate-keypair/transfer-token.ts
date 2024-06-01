import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("devnet"));

const sender = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${sender.publicKey.toBase58()}`
);

const recipient_keypair = getKeypairFromEnvironment("SECRET_KEY_2");

console.log(
  `🔑 Loaded our recipient_keypair securely, using an env file! Our public key is: ${recipient_keypair.publicKey.toBase58()}`
);

// Add the recipient public key here.
const recipient = new PublicKey(
  // "YOUR_RECIPIENT_HERE"
  recipient_keypair.publicKey
);

console.log(`recepient is: ${recipient}`);

// Subtitute in your token mint account
const tokenMintAccount = new PublicKey(
  // "YOUR_TOKEN_MINT_ADDRESS_HERE"
  process.env.MINT_ADDRESS?.toString() || ""
);

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

console.log(`💸 Attempting to send 1 token to ${recipient.toBase58()}...`);

// Get or create the source and destination token accounts to store this token
const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  sender,
  tokenMintAccount,
  sender.publicKey
);

const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  sender,
  tokenMintAccount,
  recipient
);

// Transfer the tokens
const signature = await transfer(
  connection,
  sender,
  sourceTokenAccount.address,
  destinationTokenAccount.address,
  sender,
  1 * MINOR_UNITS_PER_MAJOR_UNITS
);

const explorerLink = getExplorerLink("transaction", signature, "devnet");

console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}!`);
