/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',        // Olive Green
        secondary: '#A8D5BA',      // Sage
        background: '#F9F9F9',     // Off-white
        text: '#2F3E46',           // Deep Forest
      },
    },
  },
  plugins: [],
}
