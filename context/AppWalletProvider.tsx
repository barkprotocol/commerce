"use client";

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  WalletConnectAdapter, // Import WalletConnectAdapter
} from "@solana/wallet-adapter-wallets";
// Uncomment if needed
// import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

interface AppWalletProviderProps {
  children: React.ReactNode;
}

export default function AppWalletProvider({
  children,
}: AppWalletProviderProps) {
  // Configure network based on environment variable or default to Devnet
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;

  // Validate and set network endpoint
  const endpoint = useMemo(() => {
    if (!Object.values(WalletAdapterNetwork).includes(network)) {
      console.error(`Invalid network configuration: ${network}. Defaulting to Devnet.`);
      return clusterApiUrl(WalletAdapterNetwork.Devnet);
    }
    return clusterApiUrl(network);
  }, [network]);

  // Define available wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
      new WalletConnectAdapter({
        options: {
          qrcode: true, // Enable QR code scanning
        },
      }),
      // Uncomment if you need to use UnsafeBurner
      // new UnsafeBurnerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{ commitment: "confirmed" }}
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
