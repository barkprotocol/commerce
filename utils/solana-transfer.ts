import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

interface TransferResult {
  success: boolean;
  signature?: string;
  error?: string; // String type for easier handling and display
}

/**
 * Transfers SOL from one wallet to another.
 *
 * @param amount - The amount of SOL to transfer.
 * @param fromPubKey - The public key of the sender's wallet.
 * @param toPubKey - The public key of the recipient's wallet.
 * @param sendTransaction - Function to send the transaction.
 * @returns A result object indicating success or failure and a transaction signature if successful.
 */
const transferSolana = async (
  amount: number,
  fromPubKey: PublicKey,
  toPubKey: PublicKey,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>
): Promise<TransferResult> => {
  if (!fromPubKey) {
    return { success: false, error: "Sender wallet is not connected." };
  }

  if (amount <= 0) {
    return { success: false, error: "Amount must be greater than 0." };
  }

  if (!toPubKey) {
    return { success: false, error: "Recipient public key is invalid." };
  }

  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Check sender's balance
    const balance = await connection.getBalance(fromPubKey);
    const lamports = Math.floor(amount * LAMPORTS_PER_SOL); // Convert SOL to lamports

    if (balance < lamports) {
      return { success: false, error: "Insufficient balance to cover the transfer amount." };
    }

    // Create the transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromPubKey,
        toPubkey: toPubKey,
        lamports: lamports,
      })
    );

    transaction.feePayer = fromPubKey;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // Sign and send the transaction
    const signature = await sendTransaction(transaction, connection);

    // Confirm the transaction
    await connection.confirmTransaction(signature, "confirmed");

    return { success: true, signature };
  } catch (error) {
    console.error("Error sending transaction:", error);
    return { success: false, error: error.message || "Unknown error occurred." };
  }
};

export default transferSolana;
