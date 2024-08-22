import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#000000",
        primary: {
          50: "#7d1e1e",
          100: "#721c1c",
          200: "#661919",
          300: "#5a1717",
          400: "#4e1414",
          500: "#450a0a",
          600: "#3e0909",
          700: "#360808",
          800: "#2f0707",
          900: "#270606",
          DEFAULT: "#450a0a",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#6f6f6f",
          100: "#636363",
          200: "#575757",
          300: "#4b4b4b",
          400: "#3f3f3f",
          500: "#434343",
          600: "#3b3b3b",
          700: "#333333",
          800: "#2b2b2b",
          900: "#242424",
          DEFAULT: "#434343",
          foreground: "#ffffff",
        },
        focus: "#450a0a",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      layout: {
        disabledOpacity: "0.4",
        radius: {
          small: "4px",
          medium: "8px",
          large: "12px",
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;
