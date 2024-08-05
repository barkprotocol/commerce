/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Enable React Strict Mode for highlighting potential problems
    swcMinify: true, // Use the SWC compiler for minification for faster builds
    images: {
      domains: ['example.com'], // Allow images from these domains
      formats: ['image/avif', 'image/webp'], // Enable modern image formats
    },
    i18n: {
      locales: ['en', 'es'], // Supported locales
      defaultLocale: 'en', // Default locale
    },
    webpack: (config, { isServer }) => {
      // Custom webpack configuration
      if (!isServer) {
        config.resolve.fallback = {
          fs: false, // Disable 'fs' module for client-side
        };
      }
      return config;
    },
    eslint: {
      ignoreDuringBuilds: true, // Ignore ESLint errors during builds
    },
    experimental: {
      scrollRestoration: true, // Experimental feature for scroll restoration
    },
  };
  
  export default nextConfig;
  