/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#4F46E5', // Indigo-600
        secondary: '#10B981', // Emerald-500
        background: '#F3F4F6', // Gray-100
        card: '#FFFFFF',
        textMain: '#1F2937', // Gray-800
        textMuted: '#6B7280', // Gray-500
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(79, 70, 229, 0.3)',
      },
      borderRadius: {
        'xl': '1.25rem', // 20px
      }
    },
  },
  plugins: [],
}
