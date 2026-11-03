/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          primary: '#176B4D',       // Forest Green
          primaryDark: '#0E4834',   // Deep Forest Green
          primaryLight: '#238965',  // Vibrant Leaf Green
          secondary: '#DDF3E4',     // Light Mint Green
          secondaryDark: '#B8E6C6', // Medium Mint
          bg: '#F8FAF7',            // Off White Clean Canvas
          accent: '#F4C95D',        // Soft Warm Yellow
          accentHover: '#E5B847',   // Deeper Warm Yellow
          text: '#26332D',          // Dark Charcoal
          textMuted: '#586A62',     // Slate Charcoal
          border: '#E2EBE5',        // Soft Card Borders
          card: '#FFFFFF'           // Crisp Pure White Cards
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      boxShadow: {
        subtle: '0 2px 10px rgba(23, 107, 77, 0.05)',
        card: '0 4px 20px -2px rgba(38, 51, 45, 0.06)',
        cardHover: '0 12px 30px -4px rgba(23, 107, 77, 0.12)'
      }
    },
  },
  plugins: [],
}
