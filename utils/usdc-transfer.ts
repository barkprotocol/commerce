import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";

const USDC_DEV_PUBLIC_KEY = process.env.USDC_DEV_PUBLIC_KEY || "3YdPmr4VtvtDqZJJESEYbbHDVSL6wuoocKkgHfHK7Uxd";

interface TransferResult {
  success: boolean;
  signature?: string;
  error?: string; // Use string for easier error message handling
}

const transferUsdc = async (
  amount: number,
  fromPublicKey: PublicKey,
  sendTransaction: (
    transaction: Transaction,
    connection: Connection
  ) => Promise<string>,
  toPublicKeyString = "3YdPmr4VtvtDqZJJESEYbbHDVSL6wuoocKkgHfHK7Uxd"
): Promise<TransferResult> => {
  if (!fromPublicKey) {
    return { success: false, error: "Sender wallet is not connected." };
  }

  const toPublicKey = new PublicKey(toPublicKeyString);
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const mintPublicKey = new PublicKey(USDC_DEV_PUBLIC_KEY);

  try {
    // Get the sender's associated token account address
    const senderTokenAccountAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      fromPublicKey
    );

    // Get the receiver's associated token account address
    const receiverTokenAccountAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      toPublicKey
    );

    const transaction = new Transaction();

    try {
      // Check if receiver's token account exists
      await getAccount(
        connection,
        receiverTokenAccountAddress,
        "confirmed",
        TOKEN_PROGRAM_ID
      );
    } catch (e) {
      if (e instanceof Error && e.message.includes("TokenAccountNotFoundError")) {
        // Create associated token account for the receiver if it does not exist
        const createAccountInstruction = createAssociatedTokenAccountInstruction(
          fromPublicKey,
          receiverTokenAccountAddress,
          toPublicKey,
          mintPublicKey,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        transaction.add(createAccountInstruction);
      } else {
        console.error("Error checking receiver token account:", e);
        return { success: false, error: "Failed to check or create receiver's token account." };
      }
    }

    const amountInSmallestUnit = Math.round(amount * Math.pow(10, 6)); // Convert USDC to smallest unit (6 decimals)

    // Create the transfer instruction
    const transferInstruction = createTransferInstruction(
      senderTokenAccountAddress,
      receiverTokenAccountAddress,
      fromPublicKey,
      amountInSmallestUnit,
      [],
      TOKEN_PROGRAM_ID
    );

    transaction.add(transferInstruction);

    transaction.feePayer = fromPublicKey;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // Sign and send the transaction
    const signature = await sendTransaction(transaction, connection);

    console.log(`Transaction signature: ${signature}`);
    console.log(
      `You can verify the transaction on https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );

    return { success: true, signature };
  } catch (error) {
    console.error("Error performing the transfer:", error);
    return { success: false, error: error.message || "Unknown error occurred." };
  }
};

export default transferUsdc;
