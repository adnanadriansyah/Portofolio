module.exports = {
  content: ["./*.html"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Outfit', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      colors: {
        gold: {
          DEFAULT: '#c8a96d',
          light:   '#e8cc94',
          dark:    '#9a7035',
          muted:   'rgba(200,169,109,0.12)',
        },
        dark: {
          bg:    '#080810',
          bg2:   '#0d0d18',
          card:  '#10101e',
          card2: '#141428',
        },
      },
      animation: {
        'fade-up':   'fadeUp 0.75s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'marquee':   'marquee 22s linear infinite',
        'nav-in':    'navIn 0.7s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        fadeUp:   { from:{ opacity:'0', transform:'translateY(28px)' }, to:{ opacity:'1', transform:'none' } },
        pulseDot: { '0%,100%':{ opacity:'1', transform:'scale(1)' }, '50%':{ opacity:'.4', transform:'scale(.7)' } },
        marquee:  { from:{ transform:'translateX(0)' }, to:{ transform:'translateX(-50%)' } },
        navIn:    { from:{ transform:'translateY(-100%)', opacity:'0' }, to:{ transform:'none', opacity:'1' } },
      },
    },
  },
  plugins: [],
}
