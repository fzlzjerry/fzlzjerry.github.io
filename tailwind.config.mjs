/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['"Times New Roman"', 'Times', 'serif'],
      serif: ['"Times New Roman"', 'Times', 'serif'],
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch',
            fontFamily: '"Times New Roman", Times, serif',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}