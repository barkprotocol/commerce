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
  
  // Use environment variable or fallback to default BARK public key
  const BARK_PUBLIC_KEY = process.env.BARK_PUBLIC_KEY
    ? new PublicKey(process.env.BARK_PUBLIC_KEY)
    : new PublicKey("2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg");
  
  interface TransferResult {
    success: boolean;
    signature?: string;
    error?: string; // Changed to string for easier handling
  }
  
  /**
   * Transfers BARK tokens from one wallet to another.
   *
   * @param amount - The amount of BARK to transfer.
   * @param fromPublicKey - The public key of the sender's wallet.
   * @param sendTransaction - Function to send the transaction.
   * @param toPublicKeyString - The public key of the recipient's wallet.
   * @returns A result object indicating success or failure and a transaction signature if successful.
   */
  const transferBark = async (
    amount: number,
    fromPublicKey: PublicKey,
    sendTransaction: (
      transaction: Transaction,
      connection: Connection
    ) => Promise<string>,
    toPublicKeyString = "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo"
  ): Promise<TransferResult> => {
    if (!fromPublicKey) {
      return { success: false, error: "Sender wallet is not connected." };
    }
  
    const toPublicKey = new PublicKey(toPublicKeyString);
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
    try {
      const mintPublicKey = BARK_PUBLIC_KEY;
  
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
          throw e; // Rethrow error if it's not the expected account not found error
        }
      }
  
      const amountInSmallestUnit = Math.round(amount * Math.pow(10, 6)); // Convert BARK to smallest unit (6 decimals)
  
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
      return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred." };
    }
  };
  
  export default transferBark;
  