import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        custom: "1400px",
      },
      colors: {
        "bark-dark": "#090909",
        "bark-orange": "#D0BFB4",
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      fontFamily: {
        sans: ['Poppins', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Anton', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),     // Adds better default styles to form elements
    require('@tailwindcss/typography'), // Provides a set of prose classes for rich text
  ],
};

export default config;
