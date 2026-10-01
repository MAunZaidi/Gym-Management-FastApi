import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        adapt: {
          primary: "#6D5DFB",
          background: "#0F1115",
          surface: "#18181B",
          muted: "#27272A",
          text: "#FFFFFF",
          subtle: "#A1A1AA",
          success: "#2DD4BF",
          warning: "#F59E0B",
          danger: "#FB7185",
          info: "#38BDF8"
        }
      },
      borderRadius: {
        adapt: "8px"
      },
      boxShadow: {
        adapt: "0 18px 48px rgba(0, 0, 0, 0.28)",
        panel: "0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 36px rgba(0, 0, 0, 0.22)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
