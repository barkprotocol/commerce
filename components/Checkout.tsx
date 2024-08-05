"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useShoppingCart } from "@/context/shoppingCart";
import { SiSolana } from "react-icons/si";
import { BsCreditCardFill } from "react-icons/bs";
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";
import { getSolPrice } from "../utils/solPrice";
import { loadStripe } from "@stripe/stripe-js";
import { useWallet } from "@solana/wallet-adapter-react";
import PurchaseModal from "./PurchaseModal";
import Footer from "./Footer";
import { countries } from "countries-list";
import transferUsdc from "@/utils/usdc-transfer";
import transferSolana from "@/utils/solana-transfer";
import transferBark from "@/utils/bark-transfer"; // Import your BARK transfer utility

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// List of allowed countries
const allowedCountries = ["United States", "Canada", "Mexico"];

// Filtered list of allowed country data
const countryList = Object.values(countries).filter((country) =>
  allowedCountries.includes(country.name)
);

type CartItem = {
  id: string;
  quantity: number;
};

type Asset = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

interface FormData {
  name: string;
  email: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

export const CartCheckout: React.FC = () => {
  const {
    cartItems,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  const { connected, publicKey, sendTransaction } = useWallet();
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionSuccessful, setTransactionSuccessful] = useState(false);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [barkPrice, setBarkPrice] = useState<number | null>(null);
  const [usdcPrice, setUsdcPrice] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<"success" | "failure" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"SOL" | "USDC" | "BARK">("SOL");
  const [transactionSignature, setTransactionSignature] = useState("");
  const [shippingCost] = useState(10); // Set the shipping cost
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
  });

  const fetchPrice = useCallback(async () => {
    try {
      const price = await getSolPrice();
      setSolPrice(price);
    } catch (error) {
      console.error("Error fetching SOL price:", error);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  const subtotalUSD = cartItems.reduce((sum, cartItem) => {
    const matchingAsset = assets.find((asset) => asset.id === cartItem.id);
    return sum + (matchingAsset ? matchingAsset.price * cartItem.quantity : 0);
  }, 0);

  const orderTotalUSD = subtotalUSD + shippingCost;
  const subtotalSOL =
    solPrice !== null ? (subtotalUSD / solPrice).toFixed(5) : "Loading...";
  const totalSOL =
    solPrice !== null ? (orderTotalUSD / solPrice).toFixed(5) : "Loading...";

  const handleStripeClick = useCallback(async () => {
    setIsProcessing(true);
    try {
      const products = cartItems
        .map((cartItem) => {
          const matchingAsset = assets.find(
            (asset) => asset.id === cartItem.id
          );
          if (!matchingAsset) return null;

          return {
            name: matchingAsset.name,
            image: matchingAsset.image,
            description: matchingAsset.description,
            price: matchingAsset.price,
            quantity: cartItem.quantity,
          };
        })
        .filter((item): item is { name: string; image: string; description: string; price: number; quantity: number } => item !== null);

      if (products.length === 0) {
        console.error("No valid products found in cart.");
        return;
      }

      const response = await fetch(
        `https://bark-ecommerce.vercel.app/api/create-payment-intent?amount=${orderTotalUSD}&subtotal=${subtotalUSD}&shipping=${shippingCost}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products }),
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout session creation failed:", data.error);
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [cartItems, orderTotalUSD, subtotalUSD, shippingCost]);

  const handleUsdcClick = useCallback(async () => {
    if (!publicKey || !sendTransaction) {
      console.error("Wallet not connected");
      return;
    }

    try {
      setIsTransactionPending(true);
      const result = await transferUsdc(orderTotalUSD, publicKey, sendTransaction);
      if (result.success && result.signature) {
        setTransactionStatus("success");
        setPaymentMethod("USDC");
        setTransactionSignature(result.signature);
      } else {
        setTransactionStatus("failure");
      }
    } catch (error) {
      console.error("Error initiating USDC transfer:", error);
      setTransactionStatus("failure");
    } finally {
      setIsTransactionPending(false);
      setIsModalOpen(true);
    }
  }, [publicKey, sendTransaction, orderTotalUSD]);

  const handleSolanaClick = useCallback(async () => {
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      setIsTransactionPending(true);
      const solAmount = parseFloat(totalSOL);
      const result = await transferSolana(solAmount, publicKey, sendTransaction);
      if (result.success && result.signature) {
        setTransactionStatus("success");
        setPaymentMethod("SOL");
        setTransactionSignature(result.signature);
      } else {
        setTransactionStatus("failure");
      }
    } catch (error) {
      console.error("Error initiating Solana transfer:", error);
      setTransactionStatus("failure");
    } finally {
      setIsTransactionPending(false);
      setIsModalOpen(true);
    }
  }, [publicKey, sendTransaction, totalSOL]);

  const handleBarkClick = useCallback(async () => {
    if (!publicKey || !sendTransaction) {
      console.error("Wallet not connected");
      return;
    }

    try {
      setIsTransactionPending(true);
      const result = await transferBark(orderTotalUSD, publicKey, sendTransaction); // Implement this function
      if (result.success && result.signature) {
        setTransactionStatus("success");
        setPaymentMethod("BARK");
        setTransactionSignature(result.signature);
      } else {
        setTransactionStatus("failure");
      }
    } catch (error) {
      console.error("Error initiating BARK transfer:", error);
      setTransactionStatus("failure");
    } finally {
      setIsTransactionPending(false);
      setIsModalOpen(true);
    }
  }, [publicKey, sendTransaction, orderTotalUSD]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTransactionStatus(null);
  };

  const handleCryptoButtonClick = () => {
    setIsCryptoModalOpen(true);
  };

  const handleCryptoModalClose = () => {
    setIsCryptoModalOpen(false);
    setIsFormSubmitted(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
  };

  if (cartItems.length === 0) {
    return (
      <>
        <div className="py-4">
          <NavBar />
        </div>
        <div className="bg-black text-white h-screen">
          <div className="text-white flex justify-center font-bold my-10 text-[52px]">
            Shopping Cart
          </div>
          <div className="pt-10 space-y-6 flex flex-col justify-center items-center">
            <div className="pr-5">
              <Image
                src="/sad-cart-3.jpg"
                width={500}
                height={500}
                className="w-[200px] invert"
                alt="Cart"
              />
            </div>
            <div className="text-[28px] font-normal">Nothing in your bag</div>
            <div>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.8 }}
                  className="flex justify-center border-2 border-white hover:border-sol-green bg-gray-900 text-white py-3 px-10 text-[28px] font-normal rounded-full shadow-2xl"
                >
                  Back to Home
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="py-4">
        <NavBar />
      </div>
      <div className="bg-black text-white h-screen">
        <div className="text-white flex justify-center font-bold my-10 text-[52px]">
          Shopping Cart
        </div>
        <div className="px-5 py-10 space-y-8">
          {cartItems.map((cartItem) => {
            const asset = assets.find((asset) => asset.id === cartItem.id);
            if (!asset) return null;
            return (
              <div key={cartItem.id} className="flex items-center">
                <Image src={asset.image} width={100} height={100} alt={asset.name} />
                <div className="ml-4 flex-1">
                  <h2 className="text-xl font-semibold">{asset.name}</h2>
                  <p>{asset.description}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => decreaseCartQuantity(cartItem.id)}
                      className="p-1 text-lg"
                    >
                      <FaMinus />
                    </button>
                    <span className="mx-2">{cartItem.quantity}</span>
                    <button
                      onClick={() => increaseCartQuantity(cartItem.id)}
                      className="p-1 text-lg"
                    >
                      <FaPlus />
                    </button>
                    <button
                      onClick={() => removeFromCart(cartItem.id)}
                      className="ml-4 p-1 text-lg"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                  <p className="mt-2 text-lg">${(asset.price * cartItem.quantity).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
          <div className="flex justify-between mt-8 text-lg">
            <p>Subtotal:</p>
            <p>${subtotalUSD.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mt-2 text-lg">
            <p>Shipping:</p>
            <p>${shippingCost.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mt-2 text-lg">
            <p>Total:</p>
            <p>${orderTotalUSD.toFixed(2)}</p>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleStripeClick}
              className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Checkout with Stripe"}
            </button>
            <button
              onClick={handleCryptoButtonClick}
              className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              Checkout with Crypto
            </button>
          </div>
        </div>
        <Footer />
      </div>
      {isModalOpen && (
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          status={transactionStatus}
          method={paymentMethod}
          signature={transactionSignature}
        />
      )}
      {isCryptoModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white text-black p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Crypto Checkout</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Name"
                className="border p-2 rounded-lg w-full"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Email"
                className="border p-2 rounded-lg w-full"
                required
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Address"
                className="border p-2 rounded-lg w-full"
                required
              />
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleFormChange}
                placeholder="Address Line 2"
                className="border p-2 rounded-lg w-full"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                placeholder="City"
                className="border p-2 rounded-lg w-full"
                required
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleFormChange}
                placeholder="State"
                className="border p-2 rounded-lg w-full"
                required
              />
              <select
                name="country"
                value={formData.country}
                onChange={handleFormChange}
                className="border p-2 rounded-lg w-full"
                required
              >
                <option value="" disabled>Select your country</option>
                {countryList.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleFormChange}
                placeholder="Postal Code"
                className="border p-2 rounded-lg w-full"
                required
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="Phone"
                className="border p-2 rounded-lg w-full"
                required
              />
              <button
                type="submit"
                className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              >
                Submit
              </button>
            </form>
            {isFormSubmitted && <p className="mt-4 text-green-600">Form submitted successfully!</p>}
            <button
              onClick={handleCryptoModalClose}
              className="mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
