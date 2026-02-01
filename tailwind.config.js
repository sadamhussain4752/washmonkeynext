/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#dc2626", // red-600
        primaryDark: "#b91c1c",
      },
    },
  },
  plugins: [],
};
