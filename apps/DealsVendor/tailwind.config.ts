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
        teal: {
          primary: "#3E867A",
          hover: "#2d6b60",
          light: "#e8f4f2",
        },
        orange: {
          accent: "#EF9D39",
        },
        sidebar: "#0d1b2a",
        "page-bg": "#f4f7f4",
      },
    },
  },
  plugins: [],
};
export default config;
