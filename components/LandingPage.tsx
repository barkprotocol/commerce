"use client";

import { ShoppingItem } from "./ShoppingItem";
import { assets } from "../constants/productData";
import Link from "next/link";
import "../css/hologramStyles.css";

export const LandingPage = () => {
  return (
    <div className="py-8 bg-black text-white">
      <h1 className="mb-12 text-4xl font-bold text-center">Explore Our Collection</h1>
      
      {/* Subheaders */}
      <div className="flex flex-col md:flex-row justify-between mb-8 text-lg">
        <div>
          <h3 className="limitedDesignText font-light text-xl text-sol-green text-center md:text-left">
            Exclusive Designs
          </h3>
        </div>
        <div>
          <h3 className="font-light text-xl text-sol-green text-center md:text-right">
            Purchase with Solana, BARK, USDC, or Credit Card
          </h3>
        </div>
      </div>
      
      {/* Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12">
        {assets.length > 0 ? (
          assets.map((asset) => (
            <Link href={`/item-detail/${asset.id}`} key={asset.id} passHref>
              <a aria-label={`View details of ${asset.name}`} className="transition-transform transform hover:scale-105">
                <ShoppingItem {...asset} />
              </a>
            </Link>
          ))
        ) : (
          <p className="text-center text-lg">No items available at the moment.</p>
        )}
      </div>
    </div>
  );
};
