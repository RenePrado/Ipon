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
          DEFAULT: '#F4F6F8',
          elevated: '#FFFFFF',
          'elevated-2': '#ECEEF1',
          sidebar: '#ECEEF1',
        },
        text: {
          primary: '#2D3340',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
        },
        accent: {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          tertiary: '#7C3AED',
        },
        success: '#4CAF50',
        warning: '#FFB300',
        danger: '#EF5350',
        info: '#2196F3',
        border: {
          DEFAULT: '#E2E8F0',
          medium: '#CBD5E1',
          strong: '#94A3B8',
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
        'sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'md': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.08)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'dark-card': '0 2px 8px rgba(15, 17, 21, 0.5)',
      },
      keyframes: {
        messageSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blinkCursor: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
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
        blinkCursor: 'blinkCursor 0.5s infinite',
        bounceOnce: 'bounceOnce 0.8s ease-out 1',
      },
    },
  },
  plugins: [],
}

