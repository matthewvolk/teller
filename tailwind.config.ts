import { type Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        onyx: {
          50: "#fcfcfc",
          100: "#f5f5f5",
          200: "#ebebeb",
          300: "#d6d6d6",
          400: "#adadad",
          500: "#707070",
          600: "#333333",
          700: "#1f1f1f",
          800: "#141414",
          900: "#0a0a0a",
          950: "#030303",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
