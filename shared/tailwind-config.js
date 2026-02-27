// Shared Tailwind config — base colors, fonts, shadows, backgrounds
// Series pages extend this with their own accent colors via window.pageAccent

(function() {
  const baseConfig = {
    theme: {
      extend: {
        colors: {
          brand: {
            red:      '#D01200',
            redHot:   '#FF1A05',
            navy:     '#1A2460',
            navyDark: '#101840',
            navyDeep: '#080D24',
            ink:      '#06091A',
            white:    '#F0F2FF',
            silver:   '#9BA3C0',
            dim:      '#707898',
          }
        },
        fontFamily: {
          display: ['Barlow Condensed', 'sans-serif'],
          body:    ['Barlow', 'sans-serif'],
        },
        letterSpacing: {
          tightest: '-0.04em',
          tighter:  '-0.03em',
          tight:    '-0.02em',
        },
        boxShadow: {
          'red-glow':  '0 0 40px -8px rgba(208,18,0,0.45), 0 2px 8px -2px rgba(0,0,0,0.6)',
          'navy-glow': '0 0 40px -8px rgba(26,36,96,0.6), 0 2px 8px -2px rgba(0,0,0,0.6)',
          'card':      '0 4px 24px -4px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)',
          'card-hover':'0 12px 40px -8px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)',
        },
        backgroundImage: {
          'noise': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        }
      }
    }
  };

  // Merge page-specific accent colors if defined
  if (window.pageColors) {
    Object.assign(baseConfig.theme.extend.colors.brand, window.pageColors);
  }

  tailwind.config = baseConfig;
})();
