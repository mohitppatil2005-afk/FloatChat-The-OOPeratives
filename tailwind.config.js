/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.05), 0 2px 10px -2px rgba(0,0,0,0.5), 0 4px 30px -2px rgba(59,130,246,0.25)'
      }
    }
  },
  plugins: []
};
