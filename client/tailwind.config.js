module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
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
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};
