import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
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
          50: 'hsl(44, 94%, 94%)',
          100: 'hsl(43, 97%, 85%)',
          200: 'hsl(44, 97%, 75%)',
          300: 'hsl(44, 97%, 65%)',
          400: 'hsl(44, 96%, 57%)',
          500: 'hsl(44, 100%, 49%)',
          600: 'hsl(42, 100%, 49%)',
          700: 'hsl(40, 100%, 49%)',
          800: 'hsl(38, 100%, 49%)',
          900: 'hsl(35, 100%, 48%)',
          950: 'hsl(32, 100%, 47%)',
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
