/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFAF3',
        pink: {
          DEFAULT: '#FF97D0',
          50: '#FFF5FA',
          100: '#FFE8F3',
          200: '#FFD1E8',
          300: '#FFB0D8',
          400: '#FF97D0',
          500: '#E87AB5',
          600: '#D05E9A',
          700: '#A84A7B',
          800: '#803A5E',
          900: '#5C2A42',
        },
        dark: {
          DEFAULT: '#0f0f0f',
          100: '#1a1a1a',
          200: '#2a2a2a',
          300: '#3a3a3a',
        },
      },
      fontFamily: {
        vazir: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
