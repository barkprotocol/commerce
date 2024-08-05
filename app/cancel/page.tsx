import React from "react";
import Link from "next/link";

const Cancel = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-white">Order Canceled</h1>
        <p className="mt-4 text-lg text-gray-400">
          We’re sorry, but your order has been canceled. If you have any questions, please contact support.
        </p>
        <div className="mt-6">
          <Link href="/" passHref>
            <a className="text-sol-green hover:underline font-semibold">
              Go back to Home
            </a>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Cancel;
