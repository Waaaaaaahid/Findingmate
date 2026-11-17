/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#174C3B',
          dark: '#11392C',
          light: '#236551',
        },
        ivory: {
          DEFAULT: '#FAF9F6',
          dark: '#F3F0E9',
        },
        sage: {
          DEFAULT: '#E5EEE8',
          light: '#F0F6F2',
          dark: '#C8DBD0',
        },
        accent: {
          DEFAULT: '#E89A55',
          dark: '#D6833B',
          light: '#F3B47D',
        },
        ink: {
          DEFAULT: '#202522',
          muted: '#777F79',
          border: '#E8EAE6',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
