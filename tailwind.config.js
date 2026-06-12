/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1fdf64",
        background: {
          base: "#121212",
          highlight: "#1a1a1a",
          press: "#000000",
          elevated: "#242424",
        },
        text: {
          base: "#ffffff",
          subdued: "#b3b3b3",
          bright: "#ffffff",
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
    },
  },
  plugins: [],
}
