/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        terra: '#C8552A',
        gold: '#E8A830',
        green: { DEFAULT: '#0D7A3E', dark: '#0A5C2E' },
        cream: '#FDF6EC',
        sand: '#F5E6CC',
        brown: '#5C2D0A',
        sred: '#B22222',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
