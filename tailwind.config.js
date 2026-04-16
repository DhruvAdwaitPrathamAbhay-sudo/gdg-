/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cf: {
          // Foundation — The Void
          bg: '#0a0e14',
          surface: '#0a0e14',
          'surface-low': '#0f141a',
          'surface-high': '#20262f',
          'surface-bright': '#262c36',
          'surface-lowest': '#000000',

          // Accent Signals - Warm Coder Vibe (updated)
          primary: '#ff9800', // Warm Orange
          'primary-container': '#ffb74d', // Light Warm Orange
          secondary: '#ff5722', // Deep Orange
          tertiary: '#ff7043', // Warm Coral
          error: '#e53935', // Warm Red
          

          // On-colors
          'on-surface': '#f8fafc', // Slate 50
          'on-primary': '#0f172a', // Slate 900
          'on-muted': '#94a3b8', // Slate 400

          // Utility
          outline: '#334155', // Slate 700
        },
      },
      backgroundImage: {
        'cf-gradient': 'linear-gradient(135deg, #ff9800, #ff5722)',
        'cf-gradient-secondary': 'linear-gradient(135deg, #ff7043, #f4511e)',
        'cf-grid': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 39.5h40M39.5 0v40' stroke='rgba(255, 152, 0, 0.03)' stroke-width='1'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(255, 152, 0, 0.25)',
        'glow-secondary': '0 0 20px rgba(255, 87, 34, 0.25)',
        'glow-tertiary': '0 0 20px rgba(255, 112, 67, 0.25)',
        'glow-error': '0 0 20px rgba(229, 57, 53, 0.25)',
        'glass': '0 12px 40px 0 rgba(0, 0, 0, 0.6)',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        md: '0.375rem',
      },
      letterSpacing: {
        'tight-display': '-0.02em',
      },
      animation: {
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(2.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
