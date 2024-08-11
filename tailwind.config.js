/** @type {import('tailwindcss').Config} */
export default {
    content: ["./views/**/*.handlebars", "./public/src/svg/svg.js"],
    theme: {
      extend: {
        fontFamily: {
          body: ["Inter"],
          roboto: ["Roboto"],
          noto: ["Noto Sans", "sans-serif"],
          bebas: ["Bebas Neue", "sans-serif"],
        },
        colors: {
          primaryBg: "#33404d",
          secondaryBg: "#515f6c",
          thirdBg: "#202c34",
          buttonBg: "#606d7b",
        },
      },
    },
    plugins: [],
  };