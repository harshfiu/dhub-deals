import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#008000",
          "green-light": "#008000",
          "green-hover": "#006600",
          accent: "#f5a623",
          "accent-light": "#fbbf24",
          bg: "#EEF7EE",
          text: "#1f2937",
          muted: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "9999px",
      },
      boxShadow: {
        card: "0 2px 12px 0 rgba(0,0,0,0.07)",
        "card-hover": "0 6px 24px 0 rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
