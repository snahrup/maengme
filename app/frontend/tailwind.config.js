/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pure Glass System - No colors, only white with opacity
        glass: {
          5: 'rgba(255, 255, 255, 0.05)',
          8: 'rgba(255, 255, 255, 0.08)',
          10: 'rgba(255, 255, 255, 0.10)',
          15: 'rgba(255, 255, 255, 0.15)',
          20: 'rgba(255, 255, 255, 0.20)',
          25: 'rgba(255, 255, 255, 0.25)',
          30: 'rgba(255, 255, 255, 0.30)',
        },
        // Text hierarchy
        white: {
          DEFAULT: 'rgba(255, 255, 255, 1)',
          70: 'rgba(255, 255, 255, 0.7)',
          50: 'rgba(255, 255, 255, 0.5)',
          30: 'rgba(255, 255, 255, 0.3)',
        }
      },
      backdropBlur: {
        xs: '5px',
        sm: '10px',
        md: '20px',
        lg: '40px',
        xl: '60px',
      },
      borderRadius: {
        'glass-sm': '12px',
        'glass': '16px',
        'glass-lg': '24px',
        'glass-xl': '32px',
      },
      fontFamily: {
        'display': ['-apple-system', 'SF Pro Display', 'system-ui'],
        'sans': ['-apple-system', 'SF Pro Text', 'system-ui'],
      },
      fontSize: {
        // Vision Pro Typography Scale
        'timer-lg': ['72px', { lineHeight: '1', fontWeight: '200' }],
        'timer': ['48px', { lineHeight: '1', fontWeight: '200' }],
        'display': ['32px', { lineHeight: '1.2', fontWeight: '300' }],
        'title': ['24px', { lineHeight: '1.3', fontWeight: '300' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        'tiny': ['12px', { lineHeight: '1.3', fontWeight: '400' }],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'clock-sweep': 'clock-sweep 2s ease-in-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
          },
          '50%': { 
            filter: 'drop-shadow(0 0 40px rgba(255, 255, 255, 0.5))',
          },
        },
        'clock-sweep': {
          '0%': { 
            transform: 'rotate(-90deg)',
            opacity: '0',
          },
          '10%': {
            opacity: '1',
          },
          '90%': {
            opacity: '1',
          },
          '100%': { 
            transform: 'rotate(270deg)',
            opacity: '0',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { 
            transform: 'translateY(10px)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}