/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'rd-blue': '#0073E6',
        'rd-dark': '#1A1A1A',
        'rd-gray': '#F5F5F5'
      }
    },
  },
  plugins: [],
}
