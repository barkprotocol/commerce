import Head from "next/head";
import { CartCheckout } from "@/components/Checkout";
import ErrorBoundary from "@/components/ErrorBoundary"; // Ensure you have this component

export default function CheckoutPage() {
  return (
    <>
      <Head>
        <title>Checkout - BARK eCommerce</title>
        <meta name="description" content="Complete your purchase securely on BARK eCommerce. Review your cart, enter shipping details, and finalize your order." />
        <meta property="og:title" content="Checkout - BARK eCommerce" />
        <meta property="og:description" content="Complete your purchase securely on BARK eCommerce. Review your cart, enter shipping details, and finalize your order." />
        <meta property="og:url" content="https://solana-nft-minting-dapp-bark.vercel.app/checkout" />
        <meta property="og:image" content="/path-to-image.jpg" />
        {/* Add more metadata as needed */}
      </Head>

      <div className="checkout-page-container">
        <ErrorBoundary>
          <CartCheckout />
        </ErrorBoundary>
      </div>
    </>
  );
}
