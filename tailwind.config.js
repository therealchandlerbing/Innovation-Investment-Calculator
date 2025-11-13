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
        // IMPORTANT: These exact colors are used across cards, charts, and tables
        'optimistic-from': '#00BFA5', // Teal gradient start
        'optimistic-to': '#00E5CC',   // Teal gradient end
        'optimistic': '#00BFA5',      // Primary optimistic color (solid)
        'realistic-from': '#FFB300',  // Gold gradient start
        'realistic-to': '#FFC947',    // Gold gradient end
        'realistic': '#FFB300',       // Primary realistic color (solid)
        'conservative-from': '#FF6B6B', // Coral gradient start
        'conservative-to': '#FF8E8E',   // Coral gradient end
        'conservative': '#FF6B6B',    // Primary conservative color (solid)

        // UI State Colors (Semantic)
        success: '#10B981',        // Green for positive states
        warning: '#F59E0B',        // Amber for warnings/attention
        danger: '#EF4444',         // Red for errors/risks
        info: '#3b82f6',          // Blue for information
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        // Enhanced Typography Scale for Financial Dashboard
        // Based on UX review recommendations for prominent metrics
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],      // 96px - Hero metrics
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.02em' }],      // 128px - Extra large hero
      },
      spacing: {
        // Extended 8px grid spacing system
        // Supports 30-40% increase in whitespace as recommended
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        'md': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
        'lg': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
        'xl': '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
      },
      borderRadius: {
        // Standardized border radius for consistency
        '4xl': '2rem',
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
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.6s ease-out',
        fadeIn: 'fadeIn 0.8s ease-out',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        slideUp: 'slideUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
}
