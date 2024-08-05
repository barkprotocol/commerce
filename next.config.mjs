/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Enable React Strict Mode to identify potential problems in your React application.
    swcMinify: true, // Use the SWC compiler for faster minification of JavaScript.
    images: {
      domains: ['example.com'], // Allow images to be served from these domains.
      formats: ['image/avif', 'image/webp'], // Support modern image formats for better performance and quality.
    },
    i18n: {
      locales: ['en', 'es'], // List of supported locales for internationalization.
      defaultLocale: 'en', // Set the default locale for your application.
    },
    webpack: (config, { isServer }) => {
      // Custom Webpack configuration
      if (!isServer) {
        // Adjust Webpack configuration for client-side
        config.resolve.fallback = {
          fs: false, // Provide a fallback for the 'fs' module to avoid issues in the browser.
        };
      }
      return config;
    },
    eslint: {
      ignoreDuringBuilds: true, // Ignore ESLint errors during the build process. Useful for avoiding build failures due to linting issues.
    },
    experimental: {
      scrollRestoration: true, // Enable experimental feature for scroll restoration across navigations.
    },
  };
  
  export default nextConfig;
  