/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'void': '#050505',
        'midnight': '#0a0a12',
        'neon-cyan': '#00f3ff',
        'neon-purple': '#bc13fe',
        'neon-green': '#0aff0a',
        'off-white': '#e2e8f0',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        tech: ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 1s linear infinite',
        'glow': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 5px var(--neon-cyan), 0 0 10px var(--neon-cyan)'
          },
          '50%': { 
            boxShadow: '0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan), 0 0 30px var(--neon-cyan)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px)',
        'radial-glow': 'radial-gradient(ellipse at center, rgba(0, 243, 255, 0.15) 0%, transparent 70%)',
        'gradient-cyber': 'linear-gradient(135deg, #050505 0%, #0a0a12 50%, #050505 100%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00f3ff, 0 0 20px rgba(0, 243, 255, 0.5)',
        'neon-purple': '0 0 5px #bc13fe, 0 0 20px rgba(188, 19, 254, 0.5)',
        'neon-green': '0 0 5px #0aff0a, 0 0 20px rgba(10, 255, 10, 0.5)',
      },
    },
  },
  plugins: [],
}
