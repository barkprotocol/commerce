"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useShoppingCart } from "../context/shoppingCart";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { SiSolana } from "react-icons/si";
import { ImEnlarge } from "react-icons/im";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getSolPrice } from "../utils/solPrice";
import { NavBar } from "./NavBar";
import Footer from "./Footer";
import { assets } from "@/constants/productData";

export default function ShoppingItemDetail() {
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart } = useShoppingCart();
  const { id } = useParams();
  const itemId = Number(id);
  const matchingAsset = useMemo(() => assets.find((asset) => asset.id === itemId), [id]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPrice = async () => {
      try {
        const price = await getSolPrice();
        setSolPrice(price);
      } catch (err) {
        setError("Failed to fetch SOL price");
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, []);

  if (!matchingAsset) return <div className="text-white text-center">Item not found!</div>;

  const quantity = getItemQuantity(matchingAsset.id);
  const solEquivalent = solPrice !== null ? (matchingAsset.price / solPrice).toFixed(2) : "Loading...";

  return (
    <>
      <div className="py-4 bg-gray-900">
        <NavBar />
      </div>

      <div className="flex flex-col md:flex-row justify-center items-start py-10 bg-black text-white overflow-y-auto">
        <motion.div className="relative flex justify-center items-center mb-10 md:mb-0 md:mr-10">
          <Image
            width={500}
            height={500}
            src={matchingAsset.image}
            alt={matchingAsset.name}
            className="rounded-xl object-cover"
          />
          <motion.button
            whileHover={{ scale: 0.9 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => setEnlargedImage(matchingAsset.image)}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
            aria-label="Enlarge image"
          >
            <ImEnlarge size={24} />
          </motion.button>
        </motion.div>

        <div className="flex flex-col text-white max-w-lg space-y-5">
          <motion.p className="text-2xl font-semibold">{matchingAsset.name}</motion.p>

          <motion.p className="flex items-center text-xl font-medium">
            <span className="mr-1"><SiSolana /></span>
            {loading ? (
              "Loading..."
            ) : error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              <>
                {solEquivalent} SOL{" "}
                <span className="ml-1 text-gray-400">(${matchingAsset.price.toFixed(2)})</span>
              </>
            )}
          </motion.p>
          <motion.hr className="border-t-2 border-gray-600 my-2" />

          <motion.p className="text-lg font-medium">{matchingAsset.description}</motion.p>

          <motion.div className="flex flex-col items-center gap-4 md:flex-row">
            {quantity === 0 ? (
              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                className="bg-gray-900 text-white font-medium text-lg w-full md:w-auto border-2 border-gray-600 hover:border-gray-500 p-3 rounded-xl flex justify-center items-center"
                onClick={() => increaseCartQuantity(matchingAsset.id)}
                aria-label="Add item to cart"
              >
                <MdOutlineShoppingBag className="mr-4" /> Add To Cart
              </motion.button>
            ) : (
              <div className="flex items-center flex-col gap-4 bg-gray-900 p-4 rounded-xl">
                <div className="flex items-center gap-4 border-2 border-gray-600 hover:border-gray-500 rounded-xl py-2">
                  <motion.button
                    whileHover={{ scale: 0.9 }}
                    whileTap={{ scale: 0.8 }}
                    className="bg-gray-900 text-white px-4 py-2 rounded-xl"
                    onClick={() => decreaseCartQuantity(matchingAsset.id)}
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </motion.button>
                  <div className="text-lg font-medium">{quantity} in cart</div>
                  <motion.button
                    whileHover={{ scale: 0.9 }}
                    whileTap={{ scale: 0.8 }}
                    className="bg-gray-900 text-white px-4 py-2 rounded-xl"
                    onClick={() => increaseCartQuantity(matchingAsset.id)}
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />

      {enlargedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <Image
              src={enlargedImage}
              width={800}
              height={800}
              alt="Enlarged Product"
              className="object-cover rounded-xl"
            />
            <motion.button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setEnlargedImage(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
              aria-label="Close enlarged image"
            >
              <FaTimes size={24} />
            </motion.button>
          </div>
        </div>
      )}
    </>
  );
}
