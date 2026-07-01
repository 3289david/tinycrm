/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#533afd',
        'primary-deep': '#4434d4',
        'primary-press': '#2e2b8c',
        'primary-soft': '#665efd',
        'primary-subdued': '#b9b9f9',
        'brand-dark': '#1c1e54',
        ink: '#0d253d',
        'ink-secondary': '#273951',
        'ink-mute': '#64748d',
        canvas: '#ffffff',
        'canvas-soft': '#f6f9fc',
        'canvas-cream': '#f5e9d4',
        hairline: '#e3e8ee',
        'hairline-input': '#a8c3de',
        ruby: '#ea2261',
        magenta: '#f96bee',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
        xl: '16px',
        lg: '12px',
        md: '8px',
        sm: '6px',
        xs: '4px',
      },
      boxShadow: {
        card: 'rgba(0,55,112,0.08) 0 1px 3px',
        float: 'rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px',
      },
      letterSpacing: {
        display: '-1.4px',
        heading: '-0.64px',
        snug: '-0.26px',
      },
    },
  },
  plugins: [],
}
