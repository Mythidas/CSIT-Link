/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 2s linear infinite",
        "ping-sm": "ping-sm 2s cubic-bezier(0, 0, 0.1, 1) infinite" 
      },
      backgroundImage: (theme) => ({
        "theme-preset-active": `linear-gradient(to bottom right, ${theme('colors.theme-dark-400/0.8')}, ${theme('colors.theme-dark-600/0.4')})`
      })
    },
    colors: {
      "theme-dark-100": "#15161A",
      "theme-dark-200": "#222326",
      "theme-dark-300": "#25423D",
      "theme-dark-400": "#288273",
      "theme-dark-500": "#6D3E2B",
      "theme-dark-600": "#C23F0C",
      "theme-dark-accent": "#0bc1a2",
      "theme-dark-success": "#088C5C",
      "theme-dark-error": "#C53F30",
      "theme-dark-font-100": "#EAEAEB",
      "theme-dark-font-200": "#A5A7A6",
      "theme-dark-font-300": "#606061" // #7C7C7D
    }
  },
  plugins: [],
}

