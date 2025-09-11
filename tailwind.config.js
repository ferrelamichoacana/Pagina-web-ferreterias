/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores corporativos Ferretería La Michoacana
        'forest-green': '#42542D',
        'light-green': '#9CB83A',
        
        // Paleta extendida basada en los colores corporativos
        primary: {
          50: '#f4f6f1',
          100: '#e8ede0',
          200: '#d2dbc2',
          300: '#b5c399',
          400: '#9CB83A', // Verde claro corporativo
          500: '#7a9129',
          600: '#5f7220',
          700: '#4c5a1c',
          800: '#42542D', // Verde bosque corporativo
          900: '#2d3a1f',
        },
        accent: {
          50: '#f9faf7',
          100: '#f2f5ed',
          200: '#e5ebd9',
          300: '#d1dcc0',
          400: '#b8c89f',
          500: '#9CB83A',
          600: '#7a9129',
          700: '#5f7220',
          800: '#4c5a1c',
          900: '#3e4a17',
        },
        // Colores para modo oscuro
        dark: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}