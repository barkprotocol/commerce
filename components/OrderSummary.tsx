import React from "react";
import { BsCreditCardFill } from "react-icons/bs";
import { SiSolana } from "react-icons/si";

interface OrderSummaryProps {
  subtotalUSD: number;
  shippingCost: number;
  orderTotalUSD: number;
  totalSOL: string;
  onStripeClick: () => void;
  onCryptoClick: () => void;
  isProcessing: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotalUSD,
  shippingCost,
  orderTotalUSD,
  totalSOL,
  onStripeClick,
  onCryptoClick,
  isProcessing
}) => (
  <div className="md:w-1/3 mt-5 md:mt-0">
    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
    <div className="bg-gray-800 p-5 rounded-lg">
      <p className="text-lg mb-2">Subtotal: ${subtotalUSD.toFixed(2)}</p>
      <p className="text-lg mb-2">Shipping: ${shippingCost.toFixed(2)}</p>
      <p className="text-lg mb-2">Total: ${orderTotalUSD.toFixed(2)}</p>
      <p className="text-lg mb-4">Total in SOL: {totalSOL} SOL</p>
      <div className="mt-5 flex flex-col md:flex-row gap-4">
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center ${isProcessing ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"} transition-all`}
          onClick={onStripeClick}
          disabled={isProcessing}
          aria-label="Pay with Stripe"
        >
          <BsCreditCardFill className="inline mr-2" />
          {isProcessing ? "Processing..." : "Pay with Stripe"}
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-yellow-600 transition-all"
          onClick={onCryptoClick}
          aria-label="Pay with Crypto"
        >
          <SiSolana className="inline mr-2" />
          Pay with Crypto
        </button>
      </div>
    </div>
  </div>
);

export default OrderSummary;
