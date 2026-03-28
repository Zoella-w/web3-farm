import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        foreground: "#FFFFFF",
        "gray-dark": "#1A1A1A",
        "gray-light": "#2A2A2A",
        "accent-green-start": "#22C55E",
        "accent-green-mid": "#10B981",
        "accent-green-end": "#34D399",
      },
      backgroundImage: {
        "tech-gradient": "linear-gradient(90deg, #22C55E, #10B981, #34D399)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
