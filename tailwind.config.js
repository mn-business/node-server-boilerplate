/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    // fontFamily: { sans: ['Noto Sans KR', 'sans-serif'] },
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: true,
    darkTheme: "cupcake"
  },
};
