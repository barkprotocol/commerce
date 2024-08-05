"use client";

import React from "react";
import Link from "next/link";
import { SiSolana } from "react-icons/si";
import "@solana/wallet-adapter-react-ui/styles.css";
import { motion } from "framer-motion";
import { CustomWalletButton } from "./CustomWalletButton";
import { FiShoppingCart } from "react-icons/fi";
import { useShoppingCart } from "../context/shoppingCart";
import Image from "next/image";

export const NavBar: React.FC = () => {
  const { cartQuantity, isLoading } = useShoppingCart();

  return (
    <motion.nav 
      className="p-4 md:p-6 h-16 md:h-24 border-b-2 border-sol-green bg-black"
      aria-label="Main navigation bar"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
        <Link href="/" passHref>
          <motion.div
            className="flex items-center text-sol-green font-bold text-2xl md:text-4xl cursor-pointer"
            aria-label="Go to home page"
          >
            <Image 
              src="/bark-logo.svg" 
              alt="BARK Logo" 
              width={40} 
              height={40} 
              className="mr-2"
              priority
            />
            <span>BARK</span>
            <span className="ml-2 flex items-center text-xl md:text-2xl">
              <SiSolana />
              <span className="ml-1">tore</span>
            </span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/checkout" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center bg-gray-900 h-10 md:h-12 px-4 rounded-lg text-white border-2 border-white hover:border-sol-green font-medium transition-colors duration-300"
              aria-label="View shopping cart"
            >
              <FiShoppingCart className="text-lg md:text-xl mr-2" />
              <span className="text-sm md:text-lg">Cart</span>
              {!isLoading && cartQuantity > 0 && (
                <span className="ml-2 text-xs md:text-sm bg-sol-green text-white rounded-full px-2 py-1">
                  {cartQuantity}
                </span>
              )}
            </motion.button>
          </Link>

          <CustomWalletButton />
        </div>
      </div>
    </motion.nav>
  );
};
