/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./Views/**/*.cshtml", "./wwwroot/js/*.js"],
  theme: {
    extend: {
      colors: {
        "primary": "#02363b",
        "secondary": "#f9bd4b"
      }
    },
  },
  plugins: [],
}
