import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0d14",
        surface: "#11151f",
        raised: "#1a1f2e",
        line: "#252b3d",
        ink: "#eef0f6",
        muted: "#9aa1b5",
        accent: "#6366f1",
        accent2: "#22d3ee",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      borderRadius: { card: "1rem" },
    },
  },
  plugins: [],
};
export default config;
