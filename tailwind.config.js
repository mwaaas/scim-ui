/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    maxWidth: {
      // image,input,section, separator width
      Xs: "320px",
      Sm: "400px",
      Md: "500px",
      Mdl: "600px",
      Lg: "800px",
      Xl: "900px",
      Xxl: "1000px",
      Xxxl: "1200",
      //page width
      container: "1440px",
      contentContainer: "1140px",
      containerSmall: "1024px",
      containerExtraSmall: "768px",
    },
    extend: {
      screens: {
        xs: "320px",
        sm: "375px",
        smSp: "400px",
        sml: "512px",
        smLl: "660px",
        smLll: "680px",
        md: "740px",
        mdl: "900px",
        mdLl: "994px",
        mdLll: "1120px",
        lg: "1150px",
        lgl: "1180px",
        lgLl: "1232px",
        lgLll: "1260px",
        xl: "1280px",
        Xll: "1536px",
      },
      fontFamily: {
        bodyInter: ["Inter"],
        bodyRoboto: ["Roboto"],
        titleFont: ["Poppins"],
      },
      boxShadow: {
        navbarShadow: "0 10px 30px -10px rgba(2,12,27,0.7)",
      },
      colors: {
        primaryRed: "#f13a01",
        textDark: "#8892b0",
        hoverColor: "rgba(100,255,218,0.1)",
        appBg: "#F5F7FB",
        buttonBg: "#218DFA",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")],
};
