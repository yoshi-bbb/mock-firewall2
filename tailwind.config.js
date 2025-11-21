/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{ts,tsx}",
    "./App.tsx",
    "./index.tsx",
    "./constants.ts",
    "./types.ts"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Industrial Dark Palette
        bg: {
          main: '#030303',
          panel: '#0A0A0A',
          surface: '#111111',
        },
        border: {
          subtle: '#222222',
          strong: '#333333',
        },
        // Status Colors
        brand: {
          DEFAULT: '#3B82F6', // Blue
          glow: 'rgba(59, 130, 246, 0.5)',
        },
        success: {
          DEFAULT: '#10B981',
          dim: 'rgba(16, 185, 129, 0.1)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dim: 'rgba(245, 158, 11, 0.1)',
        },
        danger: {
          DEFAULT: '#EF4444',
          dim: 'rgba(239, 68, 68, 0.1)',
          glow: 'rgba(239, 68, 68, 0.5)',
        },
        neon: {
          cyan: '#06b6d4',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)",
        'striped-pattern': "repeating-linear-gradient(45deg, #000, #000 10px, #1a1a1a 10px, #1a1a1a 20px)",
        'danger-stripes': "repeating-linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.1) 10px, transparent 10px, transparent 20px)",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
        'flash': 'flash 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        scan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        flash: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.3' },
        }
      }
    },
  },
  plugins: [],
}