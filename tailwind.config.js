/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#d4af37",
        primary: "#1e3a5f",
        warm: "#fdf8ed",
        dark: "#1a080a",
        paper: "#FAF7F2",
        surface: "#FFFFFF",
        ink: "#171412",
        muted: "#6B615A",
        line: "#E6DED3",
        gold: {
          DEFAULT: "#8A6500",
          bright: "#C9A227",
          tint: "#EFE6D0",
        },
        deep: "#17110D",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
