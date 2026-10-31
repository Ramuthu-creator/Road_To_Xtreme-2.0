import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
        orbitron: ['var(--font-orbitron)'],
        space: ['var(--font-space)'],
      },
      keyframes: {
        'pill-ripple': {
          '0%':   { opacity: '0.65', transform: 'scale(1)' },
          '100%': { opacity: '0',    transform: 'scale(1.4)' },
        },
      },
      animation: {
        'pill-ripple': 'pill-ripple 2s ease-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
