/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ['"Instrument Serif"', 'Georgia', 'serif'],
      sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      grotesk: ['"Space Grotesk"', '"DM Sans"', 'system-ui', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      serif: ['"Instrument Serif"', 'Georgia', 'serif'],
    },
    extend: {
      colors: {
        bg: {
          primary: '#0C0C0E',
          secondary: '#141416',
          tertiary: '#1C1C1F',
          elevated: '#242428',
        },
        accent: {
          DEFAULT: '#E8A838',
          muted: '#C4893A',
          glow: 'rgba(232,168,56,0.15)',
          subtle: 'rgba(232,168,56,0.08)',
        },
        text: {
          primary: '#F5F5F0',
          secondary: '#A8A8A0',
          tertiary: '#6B6B65',
          quaternary: '#4A4A45',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          default: 'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.16)',
        },
        surface: {
          glass: 'rgba(255,255,255,0.03)',
          'glass-hover': 'rgba(255,255,255,0.06)',
        },
        semantic: {
          success: '#4ADE80',
          error: '#F87171',
          info: '#60A5FA',
        },
      },
      borderRadius: {
        'card': '0.75rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.4)',
        'glow': '0 0 20px rgba(232,168,56,0.15)',
        'glow-strong': '0 0 40px rgba(232,168,56,0.25)',
        'focus': '0 0 0 2px #0C0C0E, 0 0 0 4px #E8A838',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'smooth': '300ms',
        'slow': '500ms',
      },
      transitionTimingFunction: {
        'ease-out-custom': 'cubic-bezier(0, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out forwards',
        'fade-in-up': 'fadeInUp 300ms ease-out forwards',
        'slide-down': 'slideDown 200ms ease-out forwards',
        'reveal': 'reveal 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'reveal-left': 'revealLeft 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'reveal-scale': 'revealScale 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'scaleY(0.95) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scaleY(1) translateY(0)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        revealLeft: {
          '0%': { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        revealScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch',
            fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
            color: '#A8A8A0',
            '--tw-prose-body': '#A8A8A0',
            '--tw-prose-headings': '#F5F5F0',
            '--tw-prose-links': '#E8A838',
            '--tw-prose-bold': '#F5F5F0',
            '--tw-prose-counters': '#6B6B65',
            '--tw-prose-bullets': '#6B6B65',
            '--tw-prose-hr': 'rgba(255,255,255,0.10)',
            '--tw-prose-quotes': '#F5F5F0',
            '--tw-prose-quote-borders': '#E8A838',
            '--tw-prose-captions': '#6B6B65',
            '--tw-prose-code': '#F5F5F0',
            '--tw-prose-pre-code': '#A8A8A0',
            '--tw-prose-pre-bg': '#141416',
            '--tw-prose-th-borders': 'rgba(255,255,255,0.10)',
            '--tw-prose-td-borders': 'rgba(255,255,255,0.06)',
            'a': {
              color: '#E8A838',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(232,168,56,0.3)',
              transition: 'border-color 0.2s ease',
              '&:hover': {
                borderBottomColor: '#E8A838',
              },
            },
            'blockquote': {
              borderLeftColor: '#E8A838',
              color: '#A8A8A0',
            },
            'h1, h2, h3, h4': {
              fontFamily: '"Instrument Serif", Georgia, serif',
              color: '#F5F5F0',
            },
            'code': {
              color: '#F5F5F0',
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: '0.25rem',
              padding: '0.15em 0.3em',
              fontWeight: '400',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            'pre': {
              backgroundColor: '#141416',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '0.75rem',
            },
            'thead th': {
              color: '#F5F5F0',
            },
            'strong': {
              color: '#F5F5F0',
            },
            'img': {
              borderRadius: '0.75rem',
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
