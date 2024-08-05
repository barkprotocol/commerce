"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useShoppingCart } from "@/context/shoppingCart";
import Image from "next/image";
import { assets } from "@/constants/productData";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface PaymentSuccessProps {
  searchParams: {
    amount: number;
    subtotal: number;
    shipping: number;
    orderId: string; // Added orderId as a prop
  };
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  searchParams: { amount, subtotal, shipping, orderId }, // Destructured orderId
}) => {
  const { cartItems, clearCart } = useShoppingCart();
  const [isConfettiActive, setIsConfettiActive] = useState(true);
  const { width, height } = useWindowSize();

  // Function to handle confetti display
  const handleConfetti = useCallback(() => {
    const timer = setTimeout(() => {
      setIsConfettiActive(false);
    }, 5000); // Confetti will be active for 5 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    handleConfetti();
  }, [handleConfetti]);

  const handleKeepShopping = () => {
    clearCart(); // Clears the cart when the user decides to continue shopping
  };

  return (
    <main className="flex flex-col items-center min-h-screen max-w-6xl mx-auto text-neutral-100 text-center bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-50 p-4">
      {isConfettiActive && <Confetti width={width} height={height} />}

      <div className="mb-10 p-10 w-full max-w-4xl rounded-xl border-2 border-neutral-300 shadow-xl bg-neutral-100 dark:bg-neutral-800">
        <h1 className="text-lg font-bold mb-2 text-neutral-700 dark:text-neutral-200 pb-2">
          Payment Successful
        </h1>
        <h2 className="text-3xl font-bold">Thank you for your purchase!</h2>
        <p className="text-md font-medium w-full md:w-[440px] text-center py-4">
          We appreciate your order. We’re currently processing it. Hang tight and we’ll send you a confirmation very soon!
        </p>
        <h2 className="text-xl py-4 font-medium">
          Order ID: <span className="text-neutral-700 dark:text-neutral-200">{orderId}</span>
        </h2>
        <hr className="border-t-2 border-neutral-300 mb-2 w-full md:w-[700px] mx-auto" />

        <div className="mt-4 gap-4 flex flex-col items-center">
          {cartItems.length > 0 ? (
            cartItems.map((cartItem) => {
              const matchingAsset = assets.find(
                (asset) => asset.id === cartItem.id
              );
              if (!matchingAsset) return null;
              const totalProductPrice = matchingAsset.price * cartItem.quantity;

              return (
                <div key={cartItem.id} className="w-full md:w-[700px] px-2">
                  <div className="flex justify-between items-center p-2">
                    <div className="flex flex-row items-start gap-4">
                      <Image
                        src={matchingAsset.image}
                        width={100}
                        height={100}
                        alt={matchingAsset.name}
                        className="w-20 h-20 object-cover rounded-xl"
                        priority
                      />
                      <div className="flex flex-col items-start">
                        <div className="text-xl font-bold">
                          {matchingAsset.name}
                        </div>
                        <div className="text-md font-medium">
                          Quantity: {cartItem.quantity}
                        </div>
                        <div className="text-md font-medium">Size</div>
                      </div>
                    </div>
                    <div className="text-xl font-medium">
                      ${totalProductPrice.toFixed(2)}
                    </div>
                  </div>
                  <hr className="border-t-2 border-neutral-300 w-full mt-2" />
                </div>
              );
            })
          ) : (
            <p className="text-md font-medium">Your cart is empty.</p>
          )}
        </div>

        <div className="flex flex-col w-full md:w-[700px] mx-auto">
          <div className="flex justify-between text-neutral-800 dark:text-neutral-200 mt-4 font-medium px-2">
            <span className="text-lg">Subtotal:</span>
            <span className="text-lg">${(subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-neutral-800 dark:text-neutral-200 mt-2 font-medium px-2">
            <span className="text-lg">Shipping:</span>
            <span className="text-lg">${(shipping / 100).toFixed(2)}</span>
          </div>
          <hr className="border-t-2 border-neutral-300 my-2 w-full mx-auto" />
          <div className="flex justify-between text-neutral-800 dark:text-neutral-200 mt-2 font-bold px-2">
            <span className="text-xl">Total:</span>
            <span className="text-xl">${(amount / 100).toFixed(2)}</span>
          </div>
        </div>

        <Link href="/">
          <motion.button
            whileHover={{ scale: 0.95 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleKeepShopping}
            className="bg-neutral-800 dark:bg-neutral-600 text-white p-3 rounded-xl font-medium text-lg border-2 border-neutral-300 hover:border-neutral-400"
          >
            Continue Shopping
          </motion.button>
        </Link>
      </div>
    </main>
  );
};

export default PaymentSuccess;
