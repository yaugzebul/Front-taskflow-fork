/** @type {import('tailwindcss').Config} */
export default {
  // Indique à Tailwind quels fichiers scanner pour trouver les classes CSS
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // On laisse cette section vide pour le moment.
      // C'est ici que tu ajouteras tes couleurs "tf-anthracite", etc. plus tard.
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
        merriweather: ['"Merriweather Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}