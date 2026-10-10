/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#06121A',
        card: '#0D1F29',
        'card-2': '#112733',
        primary: '#06B6D4',
        accent: '#22D3EE',
        ink: '#ECFEFF',
        muted: '#7FA3B3',
        line: '#173341',
        ok: '#34D399',
        warn: '#FBBF24',
        bad: '#F87171',
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(34,211,238,.45)',
        soft: '0 20px 50px -20px rgba(0,0,0,.7)',
      },
    },
  },
  plugins: [],
}
