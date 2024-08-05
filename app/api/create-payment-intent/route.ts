import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-07-15", // Ensure compatibility with your integration
});

// Function to get all active products from Stripe
const getActiveProducts = async () => {
  const { data: products } = await stripe.products.list({ active: true });
  return products;
};

// Function to get or create a Stripe price
const getOrCreatePrice = async (productName: string, productPrice: number) => {
  // Fetch existing prices for the product
  const { data: prices } = await stripe.prices.list({
    active: true,
    expand: ["data.product"],
  });

  // Find or create the price for the given product
  const existingPrice = prices.find(
    (price) =>
      price.product.name.toLowerCase() === productName.toLowerCase()
  );

  if (existingPrice) {
    return existingPrice.id;
  }

  // Create a new price if not found
  const newProduct = await stripe.products.create({
    name: productName,
  });

  const newPrice = await stripe.prices.create({
    unit_amount: productPrice * 100, // Convert price to cents
    currency: "usd",
    product: newProduct.id,
  });

  return newPrice.id;
};

export const POST = async (request: Request) => {
  try {
    const { products } = await request.json();
    const data: { name: string; price: number; quantity: number }[] = products;

    // Calculate subtotal, shipping cost, and total amount
    const subtotalUSD = data.reduce(
      (sum, item) => sum + item.price * 100 * item.quantity,
      0
    );
    const shippingCost = 1000; // Fixed shipping cost in cents
    const orderTotalUSD = subtotalUSD + shippingCost;

    // Get or create Stripe prices
    const stripeItems = await Promise.all(
      data.map(async (product) => {
        const priceId = await getOrCreatePrice(product.name, product.price);

        return {
          price: priceId,
          quantity: product.quantity,
        };
      })
    );

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "MX"], // Specify allowed countries
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingCost,
              currency: "usd",
            },
            display_name: "Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
      ],
      line_items: stripeItems,
      mode: "payment",
      success_url: `https://solana-ecommerce-o1qe.vercel.app/payment-success?amount=${orderTotalUSD}&subtotal=${subtotalUSD}&shipping=${shippingCost}`,
      cancel_url: "https://solana-ecommerce-o1qe.vercel.app/cancel",
      automatic_tax: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
};
