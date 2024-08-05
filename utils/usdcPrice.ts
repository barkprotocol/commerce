import React from 'react';
import { convertUsdToUsdc } from './usdcPrice'; // Import the utility function

interface UsdcPriceProps {
  priceInUsd: number; // Price of the item in USD
  quantity: number; // Quantity of the item
}

/**
 * Component to display the price in USDC and its equivalent in USD.
 * 
 * @param priceInUsd - The price of the item in USD.
 * @param quantity - The quantity of the item.
 * @returns JSX.Element
 */
const UsdcPrice: React.FC<UsdcPriceProps> = ({ priceInUsd, quantity }) => {
  // Calculate total price in USD
  const totalPriceInUsd = priceInUsd * quantity;
  
  // Convert total price to USDC
  const totalPriceInUsdc = convertUsdToUsdc(totalPriceInUsd);

  return (
    <div className="flex items-center space-x-4">
      <span className="text-[16px] font-medium">
        {totalPriceInUsdc.toFixed(2)} USDC
        <span className="ml-1 text-gray-400"> (${totalPriceInUsd.toFixed(2)})</span>
      </span>
    </div>
  );
};

export default UsdcPrice;
