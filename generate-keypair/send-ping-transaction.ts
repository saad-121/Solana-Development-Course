import * as web3 from "@solana/web3.js";
import "dotenv/config";
import {
  getKeypairFromEnvironment,
  airdropIfRequired,
} from "@solana-developers/helpers";

const payer = getKeypairFromEnvironment("SECRET_KEY");
const recepient = getKeypairFromEnvironment("SECRET_KEY_2");

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

const newBalance = await airdropIfRequired(
  connection,
  payer.publicKey,
  1 * web3.LAMPORTS_PER_SOL,
  0.5 * web3.LAMPORTS_PER_SOL
);

// const PING_PROGRAM_ADDRESS = new web3.PublicKey(
//   "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
// );
// const PING_PROGRAM_DATA_ADDRESS = new web3.PublicKey(
//   "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
// );

const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
const PING_PROGRAM_DATA_ADDRESS =
  "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";

const transaction = new web3.Transaction();
const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS);
const pingProgramDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);

const instruction = new web3.TransactionInstruction({
  keys: [
    {
      pubkey: pingProgramDataId,
      isSigner: false,
      isWritable: true,
    },
  ],
  programId,
});

// const programId = web3.SystemProgram.programId;

// console.log(`programId: ${programId}`);

// const instruction = new web3.TransactionInstruction({
//   keys: [
//     {
//       pubkey: payer.publicKey,
//       isSigner: true,
//       isWritable: true,
//     },
//     {
//       pubkey: recepient.publicKey,
//       isSigner: false,
//       isWritable: true,
//     },
//   ],
//   programId,

// //   data: Buffer.from([
// //     web3.SystemProgram.transfer({
// //       fromPubkey: payer.publicKey,
// //       toPubkey: recepient.publicKey,
// //       lamports: web3.LAMPORTS_PER_SOL * 1,
// //     }),
// //   ]),
// });

transaction.add(instruction);

const signature = await web3.sendAndConfirmTransaction(
  connection,
  transaction,
  [payer]
);

console.log(
  `You can view your transaction on Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
);
