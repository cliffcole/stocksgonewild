/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [],  // No need to require('daisyui') here since @plugin in CSS
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],  // Customize as needed; enables theme switching
  },
};