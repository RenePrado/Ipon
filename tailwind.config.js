/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        bg: {
          DEFAULT: '#F5F7FA',
          elevated: '#FFFFFF',
          'elevated-2': '#F0F2F5',
        },
        text: {
          primary: '#1A1D23',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
        },
        accent: {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          tertiary: '#EC4899',
        },
        success: '#4CAF50',
        warning: '#FFB300',
        danger: '#EF5350',
        info: '#2196F3',
        border: {
          DEFAULT: '#E5E7EB',
          medium: '#D1D5DB',
          strong: '#9CA3AF',
        },
        // Dark mode colors
        dark: {
          bg: {
            DEFAULT: '#0F1115',
            elevated: '#1A1D23',
            'elevated-2': '#252830',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#A0A0A0',
            tertiary: '#6B7280',
          },
          accent: {
            primary: '#818CF8',
            secondary: '#A78BFA',
            tertiary: '#F472B6',
          },
          success: '#66BB6A',
          warning: '#FFA726',
          danger: '#EF5350',
          info: '#42A5F5',
          border: {
            DEFAULT: '#2D3038',
            medium: '#3D4048',
            strong: '#4D5058',
          },
        },
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        pingRing: {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        messageSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blinkCursor: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        pingRing: 'pingRing 2s infinite',
        messageSlideIn: 'messageSlideIn 0.25s ease-out',
        blinkCursor: 'blinkCursor 0.5s infinite',
      },
    },
  },
  plugins: [],
}

