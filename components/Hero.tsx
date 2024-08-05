"use client";

import Image from "next/image";
import Link from "next/link";
import { SiSolana } from "react-icons/si";
import { FaCoins } from "react-icons/fa";

export const Hero = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 pb-6">
      <div className="flex flex-wrap justify-between items-center mb-8 lg:mb-16">
        {/* Text Section */}
        <div className="w-full lg:w-1/3 lg:pb-24 lg:pt-48 mb-6 lg:mb-0 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white mb-4 leading-tight">
            Blockchain Fashion Meets Memecoin Innovation!
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white font-light max-w-md leading-relaxed">
            Discover the future of fashion with our Solana blockchain-powered transparency and the revolutionary BARK memecoin. 
            Shop exclusive collections, enjoy seamless transactions, and join our vibrant community today.
          </p>
          <div className="mt-6 flex gap-4">
            <Link href="/shop" passHref>
              <a className="bg-sol-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition" aria-label="Shop Now">
                Shop Now
              </a>
            </Link>
            <Link href="/learn-more" passHref>
              <a className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition" aria-label="Learn More">
                Learn More
              </a>
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-2/3 flex flex-wrap gap-4">
          {/* First Image */}
          <div className="relative z-10 -ml-4 lg:ml-0 overflow-hidden rounded-xl bg-gray-100 shadow-lg">
            <Image
              src="/hero1.webp"
              alt="Fashion items tracked on the blockchain for transparency"
              className="object-cover object-center"
              layout="intrinsic"  // Changed to 'intrinsic' for better performance with known dimensions
              width={500}
              height={500}
              priority
            />
          </div>

          {/* Second Image */}
          <div className="overflow-hidden rounded-xl bg-gray-100 shadow-lg">
            <Image
              src="/hero2.webp"
              alt="BARK memecoin for seamless transactions"
              className="object-cover object-center"
              layout="intrinsic"  // Changed to 'intrinsic' for better performance with known dimensions
              width={500}
              height={500}
              priority
            />
          </div>
        </div>
      </div>

      {/* Blockchain and BARK Info Section */}
      <div className="bg-gray-900 text-white py-8 px-4 rounded-lg shadow-lg mt-8">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="flex items-center mb-4 lg:mb-0">
            <SiSolana className="text-4xl mr-4 text-sol-green" aria-label="Solana Blockchain Icon" />
            <div>
              <h2 className="text-2xl font-bold">Blockchain Fashion</h2>
              <p className="text-lg mt-2">
                Our fashion items are tracked on the blockchain for transparency and authenticity. 
                Experience exclusive products with verified provenance.
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <FaCoins className="text-4xl mr-4 text-yellow-500" aria-label="BARK Memecoin Icon" />
            <div>
              <h2 className="text-2xl font-bold">Introducing BARK Memecoin</h2>
              <p className="text-lg mt-2">
                Use BARK memecoin for seamless transactions and exclusive offers. Join our community and 
                be part of the memecoin revolution in fashion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
