/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
        dark: '#2c3e50',
        light: '#ecf0f1',
        warning: '#e67e22',
        error: '#e74c3c',
        'curious-blue': {
          '50': '#ebf3ff',
          '100': '#dae9ff',
          '200': '#bcd4ff',
          '300': '#94b6ff',
          '400': '#6a8cff',
          '500': '#4863ff',
          '600': '#2735ff',
          '700': '#1c26e6',
          '800': '#1a25b9',
          '900': '#1a237e',
          '950': '#121654',
    },
    'results': {
        '50': '#f2f5fc',
        '100': '#e1e9f8',
        '200': '#d1def4',
        '300': '#a6c1ea',
        '400': '#7ca1de',
        '500': '#5d81d4',
        '600': '#4968c7',
        '700': '#3f55b6',
        '800': '#394794',
        '900': '#323f76',
        '950': '#222849',
    },
    'lastresult': {
        '50': '#f3f7fc',
        '100': '#e5eff9',
        '200': '#c6def1',
        '300': '#a6ceea',
        '400': '#5aa5d6',
        '500': '#3589c2',
        '600': '#256ea4',
        '700': '#1f5885',
        '800': '#1d4b6f',
        '900': '#1d3f5d',
        '950': '#13293e',
    },
    
    
      },
      
    
    },
  },
  plugins: [],
}