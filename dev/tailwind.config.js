// Only needed if you ever rebuild css/app.css with the official Tailwind CLI (v3.4):
//   npx tailwindcss@3.4.17 -c dev/tailwind.config.js -i dev/input.css -o css/app.css --minify
module.exports = {
  content: ['./index.html'],
  theme: { extend: {} },
  plugins: []
};
