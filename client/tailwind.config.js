/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#200f04',
          dim: '#200f04',
          bright: '#4b3426',
          container: '#2e1b0e',
          'container-low': '#2a170b',
          'container-high': '#3a2518',
          'container-highest': '#463022',
          'container-lowest': '#1a0a02',
          variant: '#463022',
          tint: '#ffb86c',
        },
        primary: {
          DEFAULT: '#ffc589',
          container: '#ff9e18',
          fixed: '#ffdcbc',
          'fixed-dim': '#ffb86c',
        },
        secondary: {
          DEFAULT: '#e5c195',
          container: '#5d4423',
          fixed: '#ffddb5',
          'fixed-dim': '#e5c195',
        },
        tertiary: {
          DEFAULT: '#91d9ff',
          container: '#00c2fe',
        },
        'on-surface': '#f5e6c8',
        'on-surface-variant': '#dac2ae',
        'on-primary': '#492900',
        'on-primary-container': '#673c00',
        'on-secondary': '#422c0c',
        'on-background': '#ffdbc7',
        outline: '#a28d7a',
        'outline-variant': '#544434',
        error: '#ffb4ab',
        'error-container': '#93000a',
        muted: '#a0815a',
        'inverse-surface': '#ffdbc7',
        'inverse-primary': '#895100',
        'inverse-on-surface': '#412c1e',
      },
      fontFamily: {
        heading: ['"Noto Serif"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      boxShadow: {
        ambient: '0 20px 40px rgba(0, 0, 0, 0.4)',
        'glow-amber': '0 0 20px rgba(255, 158, 24, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'pulse-amber': 'pulseAmber 2s ease-in-out infinite',
        'card-flash': 'cardFlash 1.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseAmber: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 158, 24, 0.4)' },
          '50%': { boxShadow: '0 0 20px 10px rgba(255, 158, 24, 0.2)' },
        },
        cardFlash: {
          '0%': { backgroundColor: 'rgba(255, 158, 24, 0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
