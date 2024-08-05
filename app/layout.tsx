import type { Metadata } from "next";
import "./globals.css";
import AppWalletProvider from "../context/AppWalletProvider";
import { NavBar } from "../components/NavBar";
import Footer from "../components/Footer";
import { ShoppingCartProvider } from "../context/shoppingCart";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ['latin'],
  weight: ["400", "600"], // Ensure these weights are used in your styles
});

export const metadata: Metadata = {
  title: "BARK eCommerce - Fashion & Crypto Innovations",
  description: "Explore BARK eCommerce, where cutting-edge fashion meets blockchain technology. Shop premium products and experience seamless transactions with the revolutionary BARK memecoin.",
  metadataBase: new URL("https://solana-nft-minting-dapp-bark.vercel.app/"),
  openGraph: {
    title: "BARK eCommerce - Fashion Meets Blockchain",
    description: "Discover exclusive fashion and crypto innovations at BARK eCommerce. Shop high-quality products and enjoy seamless transactions powered by the BARK memecoin.",
    url: "https://solana-nft-minting-dapp-bark.vercel.app/",
    siteName: "BARK eCommerce",
    images: [
      {
        url: "/barkSMB.png",
        width: 1260,
        height: 800,
        alt: "BARK eCommerce Logo",
      },
    ],
  },
  twitter: {
    site: "@bark_protocol",
    creator: "@bark_protocol",
    card: "summary_large_image",
  },
  category: "blockchain",
  icons: "/barkSMB.png",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.className}>
      <body className="min-h-screen flex flex-col bg-black text-white">
        <AppWalletProvider>
          <ShoppingCartProvider>
            <NavBar />
            <main className="flex-grow max-w-custom w-full mx-auto px-4">
              <SpeedInsights />
              {children}
            </main>
            <Footer />
          </ShoppingCartProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}
