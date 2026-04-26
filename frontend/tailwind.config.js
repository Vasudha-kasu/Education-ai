/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "serif-display": ["Fraunces", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        "mono-eai": ["JetBrains Mono", "monospace"],
      },
      colors: {
        cream: "#f5efe4",
        parchment: "#ece2cf",
        ink: "#1a1c1a",
        terracotta: "#c84c2c",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};