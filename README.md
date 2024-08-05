# BARK - eCommerce dApp

## Overview

**BARK** is a decentralized eCommerce application built on the Solana blockchain and integrated with Stripe for seamless payment processing. This dApp allows users to browse products, add them to their cart, and complete purchases using both Solana (SOL) and traditional currencies like USD. With a focus on user experience and blockchain technology, BARK aims to revolutionize online shopping by combining the benefits of decentralization with the convenience of established payment systems.

## Features

- **Decentralized Marketplace**: Buy and sell products using Solana blockchain technology.
- **Payment Integration**: Process payments through Stripe, supporting both cryptocurrency and traditional currencies.
- **Responsive Design**: Fully responsive UI for an optimal experience on both desktop and mobile devices.
- **Secure Transactions**: Utilize blockchain for transparent and secure transactions.

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **PostCSS**: Tool for transforming CSS with JavaScript plugins.
- **Solana**: Blockchain protocol for decentralized applications.
- **Stripe**: Payment processing platform.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Stripe Account](https://stripe.com) for payment integration

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/barkprotocol/bark-ecommerce-dapp.git
   ```
2. Navigate to the project directory:
   ```bash
   cd bark
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Configuration

1. Create a `.env.local` file in the root of the project.
2. Add the required environment variables (update with your actual values):
   ```env
   USDC_DEV_PUBLIC_KEY=your_usdc_public_key
   BARK_PUBLIC_KEY=your_bark_public_key
   SOL_DEV_PUBLIC_KEY=your_sol_public_key
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

### Running the Project

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

1. Build the project:
   ```bash
   npm run build
   # or
   yarn build
   ```
2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Usage

Navigate through the application to:
- **Browse Products**: View a catalog of products available for purchase.
- **Add to Cart**: Select products and add them to your shopping cart.
- **Checkout**: Complete your purchase using SOL or traditional currencies via Stripe.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push the branch to your fork (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Solana Documentation](https://docs.solana.com/)
- [Stripe Documentation](https://stripe.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
