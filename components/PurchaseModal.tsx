"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useShoppingCart } from "@/context/shoppingCart";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { image: string; name: string; quantity: number; price: number }[];
  totalSpent: string;
  totalSOL: string;
  totalBARK: string;
  paymentMethod: "SOL" | "USDC" | "BARK";
  transactionSignature: string;
  shippingCost: number;
  subtotalUSD: number;
  subtotalSOL: string;
  subtotalBARK: string;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalSpent,
  totalSOL,
  totalBARK,
  paymentMethod,
  transactionSignature,
  shippingCost,
  subtotalUSD,
  subtotalSOL,
  subtotalBARK,
}) => {
  const { clearCart } = useShoppingCart();
  const { width, height } = useWindowSize();
  const [isConfettiActive, setIsConfettiActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConfettiActive(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleKeepShopping = () => {
    clearCart();
    onClose();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  const getFormattedSubtotal = () => {
    switch (paymentMethod) {
      case "SOL":
        return `${subtotalSOL} SOL (${formatCurrency(subtotalUSD, "USD")})`;
      case "BARK":
        return `${subtotalBARK} BARK (${formatCurrency(subtotalUSD, "USD")})`;
      default:
        return formatCurrency(subtotalUSD, "USD");
    }
  };

  const getFormattedTotal = () => {
    switch (paymentMethod) {
      case "SOL":
        return `${totalSOL} SOL (${totalSpent})`;
      case "BARK":
        return `${totalBARK} BARK (${totalSpent})`;
      default:
        return `${totalSpent} USDC`;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4" 
      role="dialog" 
      aria-labelledby="purchase-modal-title" 
      aria-modal="true"
    >
      {isConfettiActive && <Confetti width={width} height={height} />}
      <div 
        className="bg-gray-800 p-6 rounded-lg w-full md:max-w-4xl relative border-2 border-gray-600 shadow-2xl shadow-gray-600 overflow-hidden overflow-y-auto"
        role="document"
      >
        <motion.button
          whileHover={{ scale: 0.9 }}
          whileTap={{ scale: 0.8 }}
          onClick={handleKeepShopping}
          className="absolute top-2 right-2 text-white hover:text-gray-400"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </motion.button>
        <div className="flex flex-col items-center text-center">
          <h2 id="purchase-modal-title" className="text-gray-300 text-2xl md:text-3xl font-bold mb-4">
            Thank You for Your Purchase!
          </h2>
          <p className="text-sm md:text-base text-white mb-6">
            Your order has been successfully processed. We’re preparing your items for shipment and will send you a confirmation email shortly.
          </p>
        </div>

        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Image
                    src={item.image || '/default-image.jpg'} // Fallback image
                    width={60}
                    height={60}
                    alt={item.name || 'Item Image'} // Fallback alt text
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="ml-4 text-white">
                    <div className="font-semibold text-lg">{item.name || 'Unknown Item'}</div>
                    <div className="font-medium text-sm">
                      Quantity: {item.quantity || 0}
                    </div>
                  </div>
                </div>
                <div className="text-white font-medium text-md">
                  {formatCurrency(item.price * (item.quantity || 0), "USD")}
                </div>
              </div>
              <hr className="border-t-2 border-gray-600 my-4" />
            </React.Fragment>
          ))
        ) : (
          <p className="text-white text-center">No items in the cart.</p>
        )}

        <div className="flex justify-between text-white font-medium text-md mb-2">
          <div>Subtotal:</div>
          <div>{getFormattedSubtotal()}</div>
        </div>

        <div className="flex justify-between text-white font-medium text-md mb-2">
          <div>Shipping:</div>
          <div>{formatCurrency(shippingCost, "USD")}</div>
        </div>

        <hr className="border-t-2 border-gray-600 my-4" />

        <div className="flex justify-between text-white font-bold text-lg mb-4">
          <div>Total:</div>
          <div>{getFormattedTotal()}</div>
        </div>

        <div className="mt-4 text-center">
          <a
            href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 underline text-sm"
          >
            View Transaction Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
