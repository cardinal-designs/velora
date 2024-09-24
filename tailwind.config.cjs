/** @type {import('tailwindcss').Config} */

let plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
		'./**/*.liquid',
    './frontend/**/*.{js,ts,jsx,tsx}'
	],
  safelist: [

  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 50s linear infinite',
        spin: 'spin 0.5s linear infinite'
      },
      aria: {
        unhidden: 'hidden="false"',
      },
      aspectRatio: {
        product: '5 / 7',
      },
      borderWidth: {
        '1': '1px',
      },
      colors: {
        error: '#FF0000',
        "cream": "#F1ECE3",
        "brown": {
          "DEFAULT": "#2B1D0A",
          "light": "#4A2425"
        },
        "blue": "#95A3B7"
      },
      fontFamily: {
        'arizona-flare': ['arizona-flare', 'serif'],
        'oracle': ['oracle', 'sans-serif'],
        'pangram': ['oracle', 'sans-serif']
      },
      fontSize: {
        // Headings
        'h1': ['80px', { lineHeight: '1', letterSpacing: '0', }],
        'h2': ['71px', { lineHeight: '1.2', letterSpacing: '0', }],
        'h3': ['60px', { lineHeight: '1.1', letterSpacing: '0', }],
        'h4': ['48px', { lineHeight: '1.1', letterSpacing: '0', }],
        'h5': ['36px', { lineHeight: '1.2', letterSpacing: '0', }],
        'h6': ['26px', { lineHeight: '1.2', letterSpacing: '0', }],
        'h7': ['20px', { lineHeight: '1.1', letterSpacing: '0', }],
         // Mobile Headings
         'm-h1': ['40px', { lineHeight: '1.3', letterSpacing: '0', }],
         'm-h2': ['32px', { lineHeight: '1.3', letterSpacing: '0', }],
         'm-h3': ['26px', { lineHeight: '1.3', letterSpacing: '0', }],
         'm-h4': ['20px', { lineHeight: '1.3', letterSpacing: '0', }],
         'm-h5': ['16px', { lineHeight: '1.3', letterSpacing: '0', }],
        // Body
        'body': ['18px', { lineHeight: '1.1', letterSpacing: '0', }],
        'body-1': ['18px', { lineHeight: '1.1', letterSpacing: '0', }],
        'body-2': ['16px', { lineHeight: '1.1', letterSpacing: '0', }],
        'body-3': ['14px', { lineHeight: '1.1', letterSpacing: '0', }],
        'body-4': ['12px', { lineHeight: '1.1', letterSpacing: '0', }],
        // Mobile Body
        'm-body': ['12px', { lineHeight: '1.5', letterSpacing: '0', }],
        // Captions
        'caption': ['20px', { lineHeight: '1.1', letterSpacing: '.1em', }],
        'caption-1': ['20px', { lineHeight: '1.1', letterSpacing: '.1em', }],
        'caption-2': ['16px', { lineHeight: '1', letterSpacing: '.1em', }],
        'caption-3': ['14px', { lineHeight: '1', letterSpacing: '0.1em', }],
        'caption-4': ['12px', { lineHeight: '1', letterSpacing: '.1em', }],
      },
      gridTemplateColumns: {
        thirds: '1fr auto 1fr',
      },
      height: {
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      maxWidth: {
        'custom': 'var(--width)',
        '1440': '1440px',
      },
      screens: {
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        xxl: '1440px',
        xxxl: '1600px'
      },
      spacing: {
        '0': '0px',
        '5': '5px',
        '10': '10px',
        '15': '15px',
        '20': '20px',
        '25': '25px',
        '30': '30px',
        '40': '40px',
        '50': '50px',
        '60': '60px',
        '70': '70px',
        '80': '80px',
        '90': '90px',
        '100': '100px',
        '120': '120px',
        '150': '150px',
        'half': '50%',
        'full': '100%',
      },
      transitionDuration: {
        DEFAULT: '300ms',
        0: '0s',
        slow: '700ms',
      },
      transitionProperty: {
        none: 'none',
        all: 'all',
        DEFAULT: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
        color: 'color',
        colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
        opacity: 'opacity',
        position: 'top, right, bottom, left',
        size: 'height, width',
        transform: 'transform',
        visibility: 'opacity, visibility',
      },
      width: {

      },
      zIndex: {
        bottom: '-1',
        top: '999999',
      }
    }
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    plugin(function({ matchUtilities, theme}) {
      matchUtilities(
        {
          'aspect': (value) => ({
            '@supports (aspect-ratio: 1 / 1)': {
              aspectRatio: value
            },
            '@supports not (aspect-ratio: 1 / 1)': {
              position: 'relative',
              '&::before': {
                content: '""',
                float: 'left',
                paddingTop: `calc(100%/ (${value}))`,
              },
              '&::after': {
                clear: 'left',
                content: '""',
                display: 'block'
              }
            },
          }),
        },
        { values: theme('aspectRatio')}
      )
    })
  ]
}