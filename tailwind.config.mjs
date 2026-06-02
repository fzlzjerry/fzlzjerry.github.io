/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      // GALLERY — warm-paper Swiss catalogue. Characterful grotesk display + clean grotesk body.
      display: ['"Bricolage Grotesque"', 'Georgia', 'serif'],
      sans: ['"Hanken Grotesk"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      grotesk: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      mono: ['"Spline Sans Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      serif: ['"Bricolage Grotesque"', 'Georgia', 'serif'],
    },
    extend: {
      colors: {
        // All semantic tokens resolve to CSS variables defined in Layout :root,
        // so the whole site recolors from one place.
        paper: 'var(--paper)',
        bg: {
          primary: 'var(--paper)',
          secondary: 'var(--paper-sink)',
          tertiary: 'var(--paper-edge)',
          elevated: 'var(--paper-edge)',
        },
        accent: {
          DEFAULT: 'var(--ochre)',
          muted: 'var(--ochre-deep)',
          glow: 'var(--ochre-soft)',
          subtle: 'var(--ochre-faint)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
          faint: 'var(--ink-faint)',
          ghost: 'var(--ink-ghost)',
        },
        text: {
          primary: 'var(--ink)',
          secondary: 'var(--ink-soft)',
          tertiary: 'var(--ink-faint)',
          quaternary: 'var(--ink-ghost)',
        },
        border: {
          subtle: 'var(--line)',
          default: 'var(--line)',
          strong: 'var(--line-strong)',
        },
        surface: {
          glass: 'var(--panel)',
          'glass-hover': 'var(--panel-hover)',
        },
        semantic: {
          success: 'var(--ok)',
          error: 'var(--err)',
          info: 'var(--info)',
        },
      },
      borderRadius: {
        'card': '0.125rem',
      },
      boxShadow: {
        'card': '0 1px 0 var(--line)',
        'card-hover': '0 18px 50px -28px rgba(40,30,18,0.42)',
        'glow': '0 0 0 1px var(--ochre-faint)',
        'glow-strong': '0 24px 60px -30px rgba(40,30,18,0.5)',
        'focus': '0 0 0 2px var(--paper), 0 0 0 4px var(--ochre)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '220ms',
        'smooth': '320ms',
        'slow': '560ms',
      },
      transitionTimingFunction: {
        'ease-out-custom': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'bounce': 'cubic-bezier(0.34, 1.4, 0.64, 1)',
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 320ms cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in-up': 'fadeInUp 420ms cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-down': 'slideDown 220ms cubic-bezier(0.22,1,0.36,1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
            color: 'var(--ink-soft)',
            '--tw-prose-body': 'var(--ink-soft)',
            '--tw-prose-headings': 'var(--ink)',
            '--tw-prose-links': 'var(--ochre)',
            '--tw-prose-bold': 'var(--ink)',
            '--tw-prose-counters': 'var(--ink-faint)',
            '--tw-prose-bullets': 'var(--ochre)',
            '--tw-prose-hr': 'var(--line)',
            '--tw-prose-quotes': 'var(--ink)',
            '--tw-prose-quote-borders': 'var(--ochre)',
            '--tw-prose-captions': 'var(--ink-faint)',
            '--tw-prose-code': 'var(--ink)',
            '--tw-prose-pre-code': '#e9e3d4',
            '--tw-prose-pre-bg': 'var(--code-bg)',
            '--tw-prose-th-borders': 'var(--line-strong)',
            '--tw-prose-td-borders': 'var(--line)',
            'a': {
              color: 'var(--ochre)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--ochre-faint)',
              transition: 'border-color 0.2s ease',
              '&:hover': {
                borderBottomColor: 'var(--ochre)',
              },
            },
            'blockquote': {
              borderLeftWidth: '2px',
              borderLeftColor: 'var(--ochre)',
              color: 'var(--ink)',
              fontStyle: 'normal',
              fontFamily: '"Bricolage Grotesque", Georgia, serif',
            },
            'h1, h2, h3, h4': {
              fontFamily: '"Bricolage Grotesque", Georgia, serif',
              color: 'var(--ink)',
              fontWeight: '500',
              letterSpacing: '-0.02em',
            },
            'code': {
              color: 'var(--ink)',
              backgroundColor: 'var(--paper-edge)',
              borderRadius: '0.125rem',
              padding: '0.15em 0.35em',
              fontWeight: '400',
              fontSize: '0.9em',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            'pre': {
              backgroundColor: 'var(--code-bg)',
              border: '1px solid var(--line)',
              borderRadius: '0.25rem',
            },
            'thead th': {
              color: 'var(--ink)',
            },
            'strong': {
              color: 'var(--ink)',
            },
            'img': {
              borderRadius: '0.25rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
