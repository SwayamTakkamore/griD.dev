/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // GitHub color scheme
        'gh-canvas-default': '#ffffff',
        'gh-canvas-subtle': '#f6f8fa',
        'gh-canvas-inset': '#f6f8fa',
        'gh-border-default': '#d0d7de',
        'gh-border-muted': '#d8dee4',
        'gh-neutral-emphasis': '#6e7781',
        'gh-neutral-muted': 'rgba(175,184,193,0.2)',
        'gh-accent-fg': '#0969da',
        'gh-accent-emphasis': '#0969da',
        'gh-accent-muted': 'rgba(84,174,255,0.4)',
        'gh-accent-subtle': '#ddf4ff',
        'gh-success-fg': '#1a7f37',
        'gh-success-emphasis': '#1f883d',
        'gh-success-muted': 'rgba(74,194,107,0.4)',
        'gh-attention-fg': '#9a6700',
        'gh-attention-emphasis': '#bf8700',
        'gh-attention-muted': 'rgba(212,167,44,0.4)',
        'gh-danger-fg': '#d1242f',
        'gh-danger-emphasis': '#cf222e',
        'gh-fg-default': '#1f2328',
        'gh-fg-muted': '#656d76',
        'gh-fg-subtle': '#6e7781',
        // Dark mode
        'gh-dark-canvas-default': '#0d1117',
        'gh-dark-canvas-subtle': '#161b22',
        'gh-dark-canvas-inset': '#010409',
        'gh-dark-border-default': '#30363d',
        'gh-dark-border-muted': '#21262d',
        'gh-dark-fg-default': '#e6edf3',
        'gh-dark-fg-muted': '#7d8590',
        'gh-dark-accent-fg': '#2f81f7',
        'gh-dark-accent-emphasis': '#1f6feb',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Noto Sans', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      borderRadius: {
        'gh': '6px',
        'gh-lg': '12px',
      },
      boxShadow: {
        'gh': '0 1px 0 rgba(27,31,36,0.04)',
        'gh-sm': '0 0 transparent, 0 0 transparent, 0 1px 1px rgba(0,0,0,0.075)',
        'gh-md': '0 3px 6px rgba(140,149,159,0.15)',
        'gh-lg': '0 8px 24px rgba(140,149,159,0.2)',
      },
    },
  },
  plugins: [],
}
