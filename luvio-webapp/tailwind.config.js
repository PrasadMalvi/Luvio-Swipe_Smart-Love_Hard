module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include your file paths
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
