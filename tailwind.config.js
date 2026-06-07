/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Cormorant Garamond", "serif"],
        body: ["Poppins", "Inter", "sans-serif"],
      },
      colors: {
        coffee: {
          50: "#fff8ef",
          100: "#f7ead8",
          300: "#d7b88f",
          600: "#9f6a3d",
          800: "#5b3824",
          950: "#241814",
        },
      },
    },
  },
  plugins: [],
};
