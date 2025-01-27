import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', '../../libs/frontend/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        riverbed: {
          50: 'hsl(220, 20%, 97%)',
          100: 'hsl(225, 12%, 94%)',
          200: 'hsl(218, 15%, 86%)',
          300: 'hsl(218, 14%, 74%)',
          400: 'hsl(216, 15%, 60%)',
          500: 'hsl(216, 14%, 48%)',
          600: 'hsl(219, 15%, 39%)',
          700: 'hsl(219, 15%, 30%)',
          800: 'hsl(219, 14%, 27%)',
          900: 'hsl(221, 13%, 24%)',
          950: 'hsl(218, 14%, 16%)',
        },
        golden: {
          50: 'hsl(59, 100%, 92%)',
          100: 'hsl(56, 100%, 85%)',
          200: 'hsl(57, 100%, 72%)',
          300: 'hsl(54, 100%, 59%)',
          400: 'hsl(52, 100%, 50%)',
          500: 'hsl(44, 100%, 49%)',
          600: 'hsl(38, 96%, 46%)',
          700: 'hsl(32, 94%, 39%)',
          800: 'hsl(29, 86%, 33%)',
          900: 'hsl(28, 80%, 28%)',
          950: 'hsl(27, 95%, 16%)',
        },
        cinnabar: {
          50: 'hsl(4, 100%, 97%)',
          100: 'hsl(6, 100%, 94%)',
          200: 'hsl(5, 100%, 89%)',
          300: 'hsl(5, 100%, 81%)',
          400: 'hsl(5, 100%, 70%)',
          500: 'hsl(5, 99%, 60%)',
          600: 'hsl(5, 85%, 54%)',
          700: 'hsl(5, 87%, 42%)',
          800: 'hsl(5, 82%, 35%)',
          900: 'hsl(5, 73%, 31%)',
          950: 'hsl(5, 87%, 15%)',
        },
        mint: {
          50: 'hsl(142, 52%, 96%)',
          100: 'hsl(139, 49%, 90%)',
          200: 'hsl(145, 46%, 80%)',
          300: 'hsl(148, 43%, 63%)',
          400: 'hsl(150, 38%, 52%)',
          500: 'hsl(151, 50%, 39%)',
          600: 'hsl(153, 56%, 30%)',
          700: 'hsl(154, 55%, 24%)',
          800: 'hsl(155, 52%, 20%)',
          900: 'hsl(156, 50%, 16%)',
          950: 'hsl(160, 52%, 9%)',
        },
      },
      fontFamily: {
        sans: ['var(--font-raleway)'],
        mono: ['var(--font-chivo-mono)'],
      },
      screens: {
        // widescreen: { raw: '(max-aspect-ratio: 3/2)' },
        // tallscreen: { raw: '(max-aspect-ratio: 13/20)' },
        short: { raw: '(max-height: 500px)' },
      },
    },
  },
  plugins: [],
};
export default config;
