/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // TradingView-inspired colors
        primary: '#2962ff',
        'primary-hover': '#1e53e4',
        positive: '#089981',
        negative: '#f23645',
        neutral: '#e0e3eb',
        'text-primary': '#131722',
        'text-secondary': '#787b86',
        'bg-primary': '#ffffff',
        'bg-secondary': '#f8f9fd',
        'border-color': '#e0e3eb',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      fontSize: {
        xs: '11px',
        sm: '13px',
        base: '14px',
        lg: '16px',
        xl: '18px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [{
      tradingview: {
        primary: '#2962ff',
        secondary: '#787b86',
        accent: '#2962ff',
        neutral: '#e0e3eb',
        'base-100': '#ffffff',
        'base-200': '#f8f9fd',
        'base-300': '#f0f3fa',
        'base-content': '#131722',
        success: '#089981',
        error: '#f23645',
      },
    }],
    darkTheme: false,
  },
};