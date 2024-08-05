import type { Metadata } from "next";

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
        alt: "BARK eCommerce Logo" // Adding alt text for accessibility
      },
    ],
  },
  twitter: {
    site: `@bark_protocol`,
    creator: `@bark_protocol`,
    card: "summary_large_image",
  },
  category: "blockchain",
  icons: "/barkSMB.png",
};
