/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System Colors - Investment-Grade Palette
        primary: '#0f172a',       // Navy - Headers, primary buttons
        'primary-light': '#1e293b', // Navy hover state
        accent: '#3b82f6',         // Blue - Links, badges, highlights
        'accent-light': '#60a5fa',  // Blue hover state

        // Refined Scenario Colors (Elegant Gradients)
        'optimistic-from': '#00BFA5', // Teal gradient start
        'optimistic-to': '#00E5CC',   // Teal gradient end
        'realistic-from': '#FFB300',  // Gold gradient start
        'realistic-to': '#FFC947',    // Gold gradient end
        'conservative-from': '#FF6B6B', // Coral gradient start
        'conservative-to': '#FF8E8E',   // Coral gradient end

        // Legacy (for backwards compatibility)
        success: '#00BFA5',        // Optimistic teal
        warning: '#FFB300',        // Realistic gold
        danger: '#FF6B6B',         // Conservative coral
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        'md': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
        'lg': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
        'xl': '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.6s ease-out',
        fadeIn: 'fadeIn 0.8s ease-out',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
