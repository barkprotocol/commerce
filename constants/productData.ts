// Define a TypeScript interface for the product
interface Product {
  image: string;
  id: number;
  name: string;
  price: number;
  description: string;
  category?: string; // Optional category field
  tags?: string[]; // Optional tags field
  stock?: number; // Optional stock field
  rating?: number; // Optional rating field
}

// Create a constant array of products with the defined type
export const assets: ReadonlyArray<Product> = [
  {
    image: "/images/1.webp",
    id: 1,
    name: "Product 1",
    price: 1.00,
    description: "High-quality product with exceptional features for everyday use.",
    category: "Basic",
    tags: ["affordable", "essential"],
    stock: 100,
    rating: 4.5,
  },
  {
    image: "/images/2.webp",
    id: 2,
    name: "Product 2",
    price: 10.00,
    description: "Premium product designed for superior performance and durability.",
    category: "Premium",
    tags: ["premium", "performance"],
    stock: 50,
    rating: 4.8,
  },
  {
    image: "/images/3.webp",
    id: 3,
    name: "Product 3",
    price: 2.00,
    description: "Affordable option with reliable quality for budget-conscious shoppers.",
    category: "Budget",
    tags: ["affordable", "reliable"],
    stock: 150,
    rating: 4.2,
  },
  {
    image: "/images/4.webp",
    id: 4,
    name: "Product 4",
    price: 3.00,
    description: "Value-for-money product with great features and performance.",
    category: "Value",
    tags: ["value", "features"],
    stock: 80,
    rating: 4.4,
  },
  {
    image: "/images/5.webp",
    id: 5,
    name: "Product 5",
    price: 5.00,
    description: "Versatile product suitable for a variety of uses and needs.",
    category: "Versatile",
    tags: ["versatile", "multi-use"],
    stock: 60,
    rating: 4.6,
  },
  {
    image: "/images/6.webp",
    id: 6,
    name: "Product 6",
    price: 8.00,
    description: "Top-notch product with advanced features and modern design.",
    category: "Advanced",
    tags: ["advanced", "modern"],
    stock: 30,
    rating: 4.7,
  },
  {
    image: "/images/7.webp",
    id: 7,
    name: "Product 7",
    price: 2.00,
    description: "Economical choice with dependable quality and performance.",
    category: "Economical",
    tags: ["economical", "dependable"],
    stock: 120,
    rating: 4.3,
  },
  {
    image: "/images/8.webp",
    id: 8,
    name: "Product 8",
    price: 5.00,
    description: "Reliable product offering great value and functionality.",
    category: "Reliable",
    tags: ["reliable", "value"],
    stock: 70,
    rating: 4.5,
  },
  {
    image: "/images/9.webp",
    id: 9,
    name: "Product 9",
    price: 6.00,
    description: "Stylish product with a modern design that fits any setting.",
    category: "Stylish",
    tags: ["stylish", "modern"],
    stock: 40,
    rating: 4.6,
  },
  {
    image: "/images/10.webp",
    id: 10,
    name: "Product 10",
    price: 9.00,
    description: "High-performance product with premium features and quality.",
    category: "High-Performance",
    tags: ["high-performance", "premium"],
    stock: 20,
    rating: 4.8,
  },
  {
    image: "/images/bark-streetwear.webp", // Add the appropriate path for your new image
    id: 11,
    name: "BARK Branded Street Wear",
    price: 25.00,
    description: "Exclusive BARK branded streetwear that combines style and comfort. Perfect for everyday wear or making a statement.",
    category: "Street Wear",
    tags: ["branded", "streetwear", "fashion"],
    stock: 50,
    rating: 4.9,
  },
] as const;
