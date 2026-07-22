/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Inter', 'monospace'],
      },
      colors: {
        // Light mode
        bg: {
          DEFAULT: '#FAFAFA',
          elevated: '#FFFFFF',
          'elevated-2': '#F4F4F5',
        },
        text: {
          primary: '#09090B',
          secondary: '#71717A',
          tertiary: '#A1A1AA',
        },
        accent: {
          primary: '#6366F1',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        border: {
          DEFAULT: '#E4E4E7',
        },
        // Dark mode
        dark: {
          bg: {
            DEFAULT: '#0A0A0A',
            elevated: '#111111',
            'elevated-2': '#1A1A1A',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#888888',
            tertiary: '#444444',
          },
          accent: {
            primary: '#6366F1',
          },
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          border: {
            DEFAULT: '#222222',
          },
        },
      },
      borderRadius: {
        'DEFAULT': '8px',
        'sm': '6px',
        'md': '8px',
        'lg': '8px',
        'xl': '12px',
      },
      keyframes: {
        messageSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceOnce: {
          '0%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-12px)' },
          '50%': { transform: 'translateY(0)' },
          '70%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        messageSlideIn: 'messageSlideIn 0.25s ease-out',
        bounceOnce: 'bounceOnce 0.8s ease-out 1',
      },
    },
  },
  plugins: [],
}

