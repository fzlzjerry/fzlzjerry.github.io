/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      serif: ['"Playfair Display"', '"Times New Roman"', 'Times', 'serif'],
      mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
    },
    extend: {
      colors: {
        brand: {
          bg: '#0a0a0b',
          surface: '#161618',
          text: '#ededed',
          muted: '#737373',
          accent: '#5eead4',
        },
      },
      borderRadius: {
        'card': '1rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(94, 234, 212, 0.15)',
        'glow-lg': '0 0 40px rgba(94, 234, 212, 0.2)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
        'card-hover': '0 20px 40px -12px rgb(0 0 0 / 0.5)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
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
      },
      animation: {
        'fade-in': 'fadeIn 600ms ease-out forwards',
        'fade-in-up': 'fadeInUp 600ms ease-out forwards',
        'slide-down': 'slideDown 300ms ease-out forwards',
        'slide-up': 'slideUp 500ms ease-out forwards',
        'scale-in': 'scaleIn 500ms ease-out forwards',
        'blur-in': 'blurIn 700ms ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'scaleY(0.95) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scaleY(1) translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            '--tw-prose-body': '#a3a3a3',
            '--tw-prose-headings': '#ededed',
            '--tw-prose-links': '#5eead4',
            '--tw-prose-bold': '#ededed',
            '--tw-prose-counters': '#737373',
            '--tw-prose-bullets': '#737373',
            '--tw-prose-hr': '#262626',
            '--tw-prose-quotes': '#ededed',
            '--tw-prose-quote-borders': '#5eead4',
            '--tw-prose-captions': '#737373',
            '--tw-prose-code': '#5eead4',
            '--tw-prose-pre-code': '#a3a3a3',
            '--tw-prose-pre-bg': '#161618',
            '--tw-prose-th-borders': '#404040',
            '--tw-prose-td-borders': '#262626',
            h1: { color: '#ededed', fontFamily: '"Playfair Display", serif' },
            h2: { color: '#ededed', fontFamily: '"Playfair Display", serif' },
            h3: { color: '#ededed', fontFamily: '"Playfair Display", serif' },
            h4: { color: '#ededed', fontFamily: '"Playfair Display", serif' },
            a: {
              color: '#5eead4',
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'border-color 200ms ease',
              '&:hover': {
                borderBottomColor: '#5eead4',
              },
            },
            code: {
              color: '#5eead4',
              backgroundColor: '#1a1a1c',
              padding: '0.2em 0.4em',
              borderRadius: '0.375rem',
              fontSize: '0.875em',
              fontWeight: '400',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: '#161618',
              border: '1px solid #262626',
              borderRadius: '0.75rem',
            },
            blockquote: {
              borderLeftColor: '#5eead4',
              backgroundColor: '#161618',
              padding: '1rem 1.5rem',
              borderRadius: '0 0.75rem 0.75rem 0',
            },
            img: {
              borderRadius: '0.75rem',
              border: '1px solid #262626',
            },
            table: {
              fontSize: '0.875rem',
            },
            'thead th': {
              color: '#ededed',
              borderBottomColor: '#404040',
            },
            'tbody td': {
              borderBottomColor: '#262626',
            },
            hr: {
              borderColor: '#262626',
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
