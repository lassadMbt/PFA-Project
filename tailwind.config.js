/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1f2937",   // dark grey
        secondary: "#6b7280", // medium grey
        light: "#f9fafb",     // light background
        border: "#e5e7eb",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
};