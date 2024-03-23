/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: "#FCEE74",
      secondary: "#004E50",
      primary_light: "#FFF6A5",
      secondary_light: "#43696A",
      danger: "#F44336",
      success: "#4CAF50",
    },
    extend: {
      fontFamily: {
        sans: ["Architects Daughter", "sans-serif"],
        cursiveStyle: ["Architects Daughter", "cursive"],
      },
    },
  },
  plugins: [],
};
