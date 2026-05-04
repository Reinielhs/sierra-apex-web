import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'sierra-blue': '#113B5E',
        'sierra-gold': '#C69C4D',
      },
      fontFamily: {
        sans: ['"Avenir Next"', 'sans-serif'],
      },
      backgroundImage: {
        'sierra-gradient': 'linear-gradient(to right, #113B5E, #C69C4D)',
      },
    },
  },
  plugins: [],
};
export default config;