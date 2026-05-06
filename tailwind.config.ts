import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ekalo: {
          black: "#030405",
          charcoal: "#090b10",
          panel: "rgba(12, 14, 19, 0.72)",
          gold: "#facc15",
          goldSoft: "#fde047",
          purple: "#7c3aed",
          line: "rgba(250, 204, 21, 0.26)"
        }
      },
      boxShadow: {
        gold: "0 0 38px rgba(250, 204, 21, 0.18)",
        purple: "0 0 34px rgba(124, 58, 237, 0.22)",
        card: "0 18px 70px rgba(0, 0, 0, 0.42)"
      },
      backgroundImage: {
        "radial-gold": "radial-gradient(circle at 22% 10%, rgba(250, 204, 21, 0.16), transparent 30%)",
        "radial-purple": "radial-gradient(circle at 76% 8%, rgba(124, 58, 237, 0.13), transparent 32%)"
      }
    }
  },
  plugins: []
};

export default config;
