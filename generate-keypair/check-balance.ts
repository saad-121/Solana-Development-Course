import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";

// const suppliedPublicKey = process.argv[2];
const suppliedPDomain = process.argv[2];
if (!suppliedPDomain) {
  throw new Error("Provide a public key to check the balance of!");
}
// const connection = new Connection(
//   "https://api.devnet.solana.com",
//   "confirmed"
// );

// Connect to the Solana network
const connection = new Connection(
  "https://api.mainnet-beta.solana.com",
  "confirmed"
);

async function getPublicKeyFromSolDomain(domain: string): Promise<PublicKey> {
  const { pubkey } = await getDomainKeySync(domain);
  const owner = (await NameRegistryState.retrieve(connection, pubkey)).registry
    .owner;
  console.log(`The owner of SNS Domain: ${domain} is:`, owner.toBase58());
  return owner;
}

try {
  // const publicKey = new PublicKey(suppliedPublicKey);

  // Get the public key from the supplied domain
  const publicKey = await getPublicKeyFromSolDomain(suppliedPDomain);

  // const connection = new Connection(clusterApiUrl("mainnet-beta"));

  // Get the balance in lamports
  const balanceInLamports = await connection.getBalance(publicKey);

  // Convert the balance to SOL
  const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

  console.log(
    `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL} SOL!`
  );
} catch (error) {
  // Handle errors
  console.log(error.message);
  if (error.message == `Invalid public key input`) {
    console.log("Invalid public key input");
  }
}
