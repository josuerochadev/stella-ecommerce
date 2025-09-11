module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3D2A54",
        secondary: "#1E1326",
        text: "#AEC9FF",
        special: "#FFB347",
      },
      backgroundImage: {
        "background-default": "linear-gradient(90deg, #3D2A54 0%, #1E1326 100%)",
        "background-inverse": "linear-gradient(90deg, #1E1326 0%, #3D2A54 100%)",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        serif: ['"Roboto Slab"', "serif"],
        display: ['"Dela Gothic One"', "serif"],
        action: ['"Bebas Neue"', "cursive"],
      },
      height: {
        header: "60px",
        footer: "60px",
      },
    },
  },
  plugins: [],
};
