import { type Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", 
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", 
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        logo: ["var(--font-orbitron)", "sans-serif"],
        body: ["var(--font-geist-sans)", "sans-serif"],
        code: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {},
    },
  },
  plugins: [],
};

export default config;
