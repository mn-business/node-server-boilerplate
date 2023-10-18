/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    // fontFamily: { sans: ['Noto Sans KR', 'sans-serif'] },
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
};
