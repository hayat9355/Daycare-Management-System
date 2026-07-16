/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        sky:  { DEFAULT: '#3B82F6', light: '#EFF6FF', dark: '#1D4ED8' },
        rose: { DEFAULT: '#F43F5E', light: '#FFF1F2', dark: '#BE123C' },
        amber:{ DEFAULT: '#F59E0B', light: '#FFFBEB', dark: '#B45309' },
        teal: { DEFAULT: '#14B8A6', light: '#F0FDFA', dark: '#0F766E' },
        violet:{ DEFAULT: '#8B5CF6', light: '#F5F3FF', dark: '#6D28D9' },
        emerald:{ DEFAULT: '#10B981', light: '#ECFDF5', dark: '#065F46' },
      },
    },
  },
  plugins: [],
};
