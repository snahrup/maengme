/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // From tokens.json - Liquid Glass palette
        'bg-start': '#0B1220',
        'bg-end': '#0E1A2F',
        'glass-tint': 'rgba(15, 30, 54, 0.67)',
        'glass-stroke': 'rgba(255, 255, 255, 0.2)',
        'text-primary': '#F5F7FB',
        'text-secondary': '#C9D2E3',
        'accent-primary': '#1DA1FF',
        'accent-primary2': '#007AFF',
        'accent-success': '#34C759',
        'accent-alert': '#FF3B30',
        'chip-neutral': '#C8D0E0',
        'chip-tail': '#A8C6FF',
        'radial-glow': '#00D4FF',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'monospace']
      },
      backdropBlur: {
        'panel': '18px',
        'chip': '12px'
      },
      borderRadius: {
        'glass': '22px',
        'glass-xl': '28px'
      },
      boxShadow: {
        'glass': '0 10px 30px rgba(0, 0, 0, 0.35)',
        'glow': '0 0 40px rgba(29, 161, 255, 0.4)'
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'number-tick': 'numberTick 100ms ease-out'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 }
        },
        numberTick: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' }
        }
      }
    },
  },
  plugins: [],
}