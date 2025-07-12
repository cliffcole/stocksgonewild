/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  
  theme: {
    extend: {
      colors: {
        header: '#3D4451',  // Dark gray for headings
        primary: '#2962FF',  // Blue for buttons
        positive: '#089981',  // Green +
        negative: '#F23645',  // Red -
        neutral: '#E0E3EB',  // Gray borders
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
      fontSize: {
        sm: '12px',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [{
      mytheme: {
        primary: '#2962FF',
        secondary: '#3D4451',
        accent: '#2962FF',
        neutral: '#E0E3EB',
        'base-100': '#FFFFFF',
        'base-200': '#F7F8FA',
        'base-content': '#3D4451',
      },
    }],
  },
};