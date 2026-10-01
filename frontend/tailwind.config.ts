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
          primary: "#4F46E5",
          accent: "#6366F1",
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
        adapt: "15px"
      },
      boxShadow: {
        adapt: "0 18px 48px rgba(0, 0, 0, 0.28)",
        panel: "inset 0 1px 0 rgba(255, 255, 255, 0.035), 0 8px 24px rgba(0, 0, 0, 0.14)"
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
