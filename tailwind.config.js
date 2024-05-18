/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 2s linear infinite",
        "ping-sm": "ping-sm 2s cubic-bezier(0, 0, 0.1, 1) infinite" 
      }
    },
    colors: {
      "cscol-000": "#3C8C88",
      "cscol-100": "#45A29E",
      "cscol-200": "#66FCF1",
      "cscol-300": "#C5C6C7",
      "cscol-400": "#1F2833",
      "cscol-500": "#141A21",
      "cscol-600": "#0B0C10",
      "errcol-100": "#CC1B3E",
      "wrncol-100": "#B88E1D",
      
      "base-000": "#1A1A1A",
      "base-100": "#1F1F1F",
      "base-150": "#303030",
      "base-200": "#383838",
      "base-300": "#595959",
      "accent-100": "#7F85F5",
      "font": "#FFFFFF"
    }
  },
  plugins: [],
}

