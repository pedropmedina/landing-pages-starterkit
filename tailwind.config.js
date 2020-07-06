const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: false, // we are manually purging on postcss.config.js
  theme: {
    extend: {
      fontSize: {
        'ricoma-sm': '14px',
        'ricoma-base': '17px',
        'ricoma-md': '21px',
        'ricoma-lg': '25px',
        'ricoma-lg/xl': '37px',
        'ricoma-xl': '40px',
        'ricoma-2xl': '52px',
      },
      colors: {
        blue: {
          ...colors.blue,
          light: '#3E73F0',
          dark: '#3D37E0',
          darker: '#413BDD',
          darkest: '#1E2437',
        },
        orange: {
          ...colors.orange,
          dark: '#FF7200',
          light: '#FC9500',
        },
        yellow: {
          ...colors.yellow,
          light: '#FFDF2F',
        },
      },
      inset: {
        '100': '100%',
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '1/2': '50%',
        full: '100%',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
        '5xl': '4rem',
      },
    },
    animations: {
      scaling: {
        '0%': {
          transform: 'scale(0)',
        },
        '70%': {
          transform: 'scale(1.02)',
        },
        '100%': {
          transform: 'scale(1)',
        },
      },
    },
    animationDuration: {
      default: '1s',
      '0s': '0s',
      '1/10s': '0.10s',
      '1/4s': '0.25s',
      '1/2s': '0.5s',
      '1s': '1s',
      '2s': '2s',
      '3s': '3s',
      '4s': '4s',
      '5s': '5s',
    },
    plugins: [require('tailwindcss-animations')],
  },
};
