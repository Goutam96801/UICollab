/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(45deg, purple, rgb(7, 89, 89))',
      },
      animation: {
        moveLeft: 'moveLeft 100s linear infinite',
        moveRight: 'moveRight 100s linear infinite',
        twinkle: 'twinkle 2s infinite ease-in-out',
      },
      keyframes: {
        moveLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        moveRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 1 },
        },
      },


    },
  },

  plugins: [],
}