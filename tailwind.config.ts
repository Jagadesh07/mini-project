import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101626",
        mist: "#f3f6fb",
        coral: "#ff6b4a",
        teal: "#0f8b8d",
        gold: "#f2c14e"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(16, 22, 38, 0.12)"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        sans: ["'Segoe UI'", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(16,22,38,0.08) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;
