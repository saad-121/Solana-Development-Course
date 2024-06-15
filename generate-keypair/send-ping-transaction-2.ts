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

// const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
// const PING_PROGRAM_DATA_ADDRESS =
//   "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";

// const transaction = new web3.Transaction();
// const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS);
// const pingProgramDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);

// const instruction = new web3.TransactionInstruction({
//   keys: [
//     {
//       pubkey: pingProgramDataId,
//       isSigner: false,
//       isWritable: true,
//     },
//   ],
//   programId,
// });

const programId = web3.SystemProgram.programId;

console.log(`programId: ${programId}`);

// Define the amount to transfer
const transferAmount = 0.01; // 0.01 SOL

// Instruction index for the SystemProgram transfer instruction
const transferInstructionIndex = 2;

// Create a buffer for the data to be passed to the transfer instruction
const instructionData = Buffer.alloc(4 + 8); // uint32 + uint64
// Write the instruction index to the buffer
instructionData.writeUInt32LE(transferInstructionIndex, 0);
// Write the transfer amount to the buffer
instructionData.writeBigUInt64LE(
  BigInt(transferAmount * web3.LAMPORTS_PER_SOL),
  4
);

// Manually create a transfer instruction for transferring SOL from sender to receiver
const transferInstruction = new web3.TransactionInstruction({
  keys: [
    { pubkey: payer.publicKey, isSigner: true, isWritable: true },
    { pubkey: recepient.publicKey, isSigner: false, isWritable: true },
  ],
  programId: programId,
  data: instructionData,
});

// Add the transfer instruction to a new transaction
const transaction = new web3.Transaction().add(transferInstruction);

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

// transaction.add(instruction);

const signature = await web3.sendAndConfirmTransaction(
  connection,
  transaction,
  [payer]
);

console.log(
  `You can view your transaction on Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
);
