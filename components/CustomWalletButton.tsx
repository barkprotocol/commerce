"use client";
import React, { useEffect, useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Image from "next/image";
import { WalletName } from "@solana/wallet-adapter-base";
import { motion, Variants } from "framer-motion";
import { IoMdArrowDropright } from "react-icons/io";
import { IoClose } from "react-icons/io5";

// Define animation variants
const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const dropdownVariants: Variants = {
  open: {
    clipPath: "inset(0% 0% 0% 0% round 10px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.05,
    },
  },
  closed: {
    clipPath: "inset(10% 50% 90% 50% round 10px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

const modalVariants: Variants = {
  open: {
    clipPath: "inset(0% 0% 0% 0% round 10px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.05,
    },
  },
  closed: {
    clipPath: "inset(10% 50% 90% 50% round 10px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

// Convert number to fixed decimal string
export function toFixed(num: number, fixed: number): string {
  const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)?.[0] ?? '0';
}

export const CustomWalletButton = () => {
  const { connection } = useConnection();
  const { select, wallets, publicKey, disconnect, connecting } = useWallet();
  const [open, setOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedWalletIcon, setSelectedWalletIcon] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Update balance when publicKey or connection changes
  useEffect(() => {
    if (!connection || !publicKey) return;

    const updateBalance = async () => {
      try {
        const accountInfo = await connection.getAccountInfo(publicKey);
        if (accountInfo) {
          setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
        }
      } catch (error) {
        console.error("Error fetching account info:", error);
      }
    };

    updateBalance();
    const subscriptionId = connection.onAccountChange(publicKey, updateBalance, "confirmed");

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [publicKey, connection]);

  // Handle click outside to close dropdown and modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  // Retrieve and save selected wallet icon to localStorage
  useEffect(() => {
    const savedIcon = localStorage.getItem("selectedWalletIcon");
    if (savedIcon) {
      setSelectedWalletIcon(savedIcon);
    }
  }, []);

  useEffect(() => {
    if (selectedWalletIcon) {
      localStorage.setItem("selectedWalletIcon", selectedWalletIcon);
    }
  }, [selectedWalletIcon]);

  // Handle wallet selection
  const handleWalletSelect = async (walletName: WalletName) => {
    try {
      const selectedWallet = wallets.find(
        (wallet) => wallet.adapter.name === walletName
      );
      if (selectedWallet) {
        setSelectedWalletIcon(selectedWallet.adapter.icon);
      }
      await select(walletName);
      setOpen(false);
      setDropdownOpen(false);
    } catch (error) {
      console.log("Wallet connection error:", error);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    await disconnect();
    setSelectedWalletIcon("");
    localStorage.removeItem("selectedWalletIcon");
  };

  return (
    <div className="text-white z-50">
      <div className="flex gap-2 items-center">
        {!publicKey ? (
          <motion.button
            whileHover={{ scale: 0.9 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => setOpen(true)}
            className="text-sm md:text-md font-medium border-2 border-white hover:border-gray-500 text-white py-2 px-4 w-[220px] rounded-xl"
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </motion.button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.8 }}
              className="flex text-sm md:text-sm font-medium border-2 border-white hover:border-gray-500 text-white py-2 px-4 w-[220px] rounded-xl items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedWalletIcon && (
                <Image
                  src={selectedWalletIcon}
                  alt="Wallet Icon"
                  height={24}
                  width={24}
                  className="mx-2"
                />
              )}
              <div className="truncate md:w-[80px] w-[100px] text-sm">
                {publicKey.toBase58().slice(0, 4)}..
                {publicKey.toBase58().slice(-4)}
              </div>
              <div className="text-sm flex flex-wrap ml-1">
                {balance !== null ? (
                  <div>{toFixed(balance, 2)} SOL</div>
                ) : (
                  <div>0 SOL</div>
                )}
              </div>
            </motion.button>

            <motion.div
              initial={false}
              animate={dropdownOpen ? "open" : "closed"}
              variants={dropdownVariants}
              className="absolute bg-gray-900 text-white border-2 border-white font-medium text-center text-[14px] w-[220px] mt-1 rounded-xl z-50"
            >
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                className="px-4 py-4 hover:text-gray-500 text-xs"
                onClick={() => setOpen(true)}
              >
                Change wallet
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                className="px-4 py-4 hover:text-gray-500 text-xs"
                onClick={handleDisconnect}
              >
                Disconnect
              </motion.button>
            </motion.div>
          </div>
        )}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-65 z-50">
            <motion.div
              ref={modalRef}
              initial="closed"
              animate="open"
              exit="closed"
              variants={modalVariants}
              className="relative bg-gray-900 py-4 px-10 rounded-xl max-w-[450px] w-full border-2 border-white"
              tabIndex={-1} // Allow focusing
            >
              <div className="flex flex-col gap-4">
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setOpen(false)}
                  className="absolute text-[30px] top-4 right-4 text-white hover:text-gray-500"
                >
                  <IoClose />
                </motion.button>

                <motion.h1
                  variants={itemVariants}
                  className="text-center text-[28px] font-semibold"
                >
                  Connect Wallet
                </motion.h1>
                {wallets.map((wallet) => (
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 0.95 }}
                    whileTap={{ scale: 0.85 }}
                    key={wallet.adapter.name}
                    onClick={() => handleWalletSelect(wallet.adapter.name)}
                    className="flex bg-gray-900 items-center py-4 px-6 text-white w-full border-2 border-white hover:border-gray-500 rounded-xl"
                  >
                    <Image
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      height={40}
                      width={40}
                      className="mr-5"
                    />
                    <div className="flex justify-between w-full items-center">
                      <span className="font-medium text-[16px]">
                        {wallet.adapter.name}
                      </span>
                      <span className="font-medium text-[14px] flex items-center">
                        Detected{" "}
                        <span className="text-[22px] ml-2">
                          <IoMdArrowDropright />
                        </span>
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
