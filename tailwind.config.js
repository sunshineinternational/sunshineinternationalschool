/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'pan-image': {
          '0%': { transform: 'scale(1.1) translate(0,0)' },
          '100%': { transform: 'scale(1.25) translate(-2%, -2%)' },
        },
        'pan-up': {
          '0%': { transform: 'scale(1.1) translateY(0)' },
          '100%': { transform: 'scale(1.25) translateY(-5%)' },
        },
        'pan-right': {
          '0%': { transform: 'scale(1.1) translateX(0)' },
          '100%': { transform: 'scale(1.25) translateX(5%)' },
        },
        'pan-left': {
          '0%': { transform: 'scale(1.1) translateX(0)' },
          '100%': { transform: 'scale(1.25) translateX(-5%)' },
        },
        'zoom-in': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.15)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'pan-image': 'pan-image 15s ease-out infinite alternate',
        'pan-up': 'pan-up 20s ease-out infinite alternate',
        'pan-right': 'pan-right 20s ease-out infinite alternate',
        'pan-left': 'pan-left 20s ease-out infinite alternate',
        'zoom-in': 'zoom-in 20s ease-out infinite alternate',
        'fade-in-up': 'fade-in-up 1s ease-out forwards',
        'fade-in': 'fade-in 1.5s ease-out forwards',
      },
      textShadow: {
        'lg': '2px 2px 4px rgba(0, 0, 0, 0.5)',
        'default': '0 2px 4px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}