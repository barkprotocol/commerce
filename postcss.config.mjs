/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-import': {},    // Allows you to use @import in your CSS files
    'tailwindcss': {},       // Integrate Tailwind CSS
    'autoprefixer': {},      // Add vendor prefixes to CSS rules for better browser compatibility
    ...(process.env.NODE_ENV === 'production' ? { 'cssnano': {} } : {}), // Minify CSS in production
  },
};

export default config;
