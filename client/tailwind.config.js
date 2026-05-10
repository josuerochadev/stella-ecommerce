module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: "#3D2A54",
        secondary: "#1E1326",
        text: "#AEC9FF",
        special: "#FFB347",
        accent: "#FFB347",

        // Extended purple scale
        purple: {
          950: "#0f0a18",
          900: "#1E1326",
          800: "#2a1a3e",
          700: "#3D2A54",
          600: "#4e3669",
          500: "#6247a0",
          400: "#8b72c8",
          300: "#b8a3e3",
          200: "#d8cff4",
          100: "#f0ecfd",
        },

        // Periwinkle / starlight scale
        periwinkle: {
          900: "#1e2d4a",
          700: "#2a4680",
          500: "#4d7bcc",
          300: "#7ea8e8",
          200: "#AEC9FF",
          100: "#d4e4ff",
          50: "#eef4ff",
        },

        // Amber / accent scale
        amber: {
          600: "#d4811a",
          500: "#FFB347",
          400: "#ffc76e",
          300: "#ffd99a",
          200: "#ffebc5",
        },

        // Cyan secondary accent
        cyan: {
          700: "#0a4a5c",
          600: "#0d6b86",
          500: "#0ea5c9",
          400: "#38bdf8",
          300: "#7dd3fc",
          200: "#bae6fd",
        },

        // Surfaces (elevation)
        surface: {
          0: "#0f0a18",
          1: "#1E1326",
          2: "#2a1a3e",
          3: "#3D2A54",
          4: "#4e3669",
        },
      },
      backgroundImage: {
        "background-default": "linear-gradient(135deg, #3D2A54 0%, #1E1326 55%, #0f0a18 100%)",
        "background-inverse": "linear-gradient(90deg, #1E1326 0%, #3D2A54 100%)",
        "background-header": "linear-gradient(90deg, #1E1326 0%, #3D2A54 100%)",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        serif: ['"Roboto Slab"', "serif"],
        display: ['"Dela Gothic One"', "serif"],
        action: ['"Bebas Neue"', "cursive"],
      },
      height: {
        header: "48px",
        footer: "60px",
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      boxShadow: {
        'glow-amber': '0 0 20px 4px rgba(255,179,71,0.3)',
        'glow-cyan': '0 0 20px 4px rgba(56,189,248,0.25)',
        'glow-magenta': '0 0 30px 6px rgba(224,64,251,0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'fade-up': 'fadeUp 0.6s cubic-bezier(0,0,0.2,1) both',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'hero-zoom': 'heroZoom 15s ease-in-out infinite',
        'neon-hero': 'neonHero 2s ease-in-out infinite alternate',
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
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(255,179,71,0.3)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(255,179,71,0.3), 0 0 30px 6px rgba(224,64,251,0.18)' },
        },
        heroZoom: {
          '0%': { transform: 'scale(1) translateY(0)' },
          '50%': { transform: 'scale(1.25) translateY(-10px)' },
          '100%': { transform: 'scale(1) translateY(0)' },
        },
        neonHero: {
          '0%, 100%': { textShadow: '0 0 5px #fff, 0 0 12px rgba(255,255,255,0.5), 0 0 22px rgba(255,0,255,0.2)' },
          '50%': { textShadow: '0 0 5px #fff, 0 0 18px rgba(255,0,255,0.5), 0 0 32px rgba(255,0,255,0.3)' },
        },
      },
    },
  },
  plugins: [],
};
