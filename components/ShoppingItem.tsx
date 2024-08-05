"use client";

import { SiSolana } from "react-icons/si";
import { useShoppingCart } from "../context/shoppingCart";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSolPrice } from "../utils/solPrice";

interface ShoppingItemProps {
  image: string;
  id: number;
  name: string;
  price: number;
  description: string;
}

export const ShoppingItem: React.FC<ShoppingItemProps> = ({
  image,
  name,
  price,
  description,
}) => {
  const { getItemQuantity } = useShoppingCart();
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      try {
        const fetchedPrice = await getSolPrice();
        setSolPrice(fetchedPrice);
        setError(null);
      } catch (err) {
        setError("Failed to fetch SOL price. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, []); // Empty dependency array to run only once

  const solEquivalent = solPrice !== null 
    ? (price / solPrice).toFixed(2) 
    : null;

  return (
    <div className="flex flex-col items-center bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl p-6 transition-transform transform hover:scale-95 shadow-lg">
      <div className="relative">
        <Image
          src={image}
          alt={name || 'Product Image'}
          width={400}
          height={400}
          className="rounded-xl object-cover"
          priority
        />
      </div>
      <div className="flex flex-col pt-4 text-white">
        <p className="text-lg font-semibold">{name || 'Unnamed Item'}</p>
        <p className="text-sm text-gray-400">{description || 'No description available.'}</p>
        <p className="flex text-md items-center font-medium pt-2">
          <span className="mr-1 text-yellow-400">
            <SiSolana />
          </span>
          {loading ? (
            <span className="text-gray-500">Loading...</span>
          ) : error ? (
            <span className="text-red-400">{error}</span>
          ) : (
            <>
              {solEquivalent} SOL{" "}
              <span className="ml-2 text-gray-400">(${price.toFixed(2)})</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
