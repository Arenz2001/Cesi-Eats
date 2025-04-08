/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FD6506',
        'secondary': '#F9F9F9', // Enhanced grayish blue for more contrast
        'background': '#FFFFFF',
        'side-bg': '#FFFFFF', // Enhanced for better contrast
        'card-bg': '#FFFFFF',
        'text-primary': '#1A202C', // Darker text for better readability
        'text-secondary': '#4A5568', // Medium dark for secondary text
        'button-modify': '#4F46E5', // Indigo
        'button-suspend': '#F97316', // Orange
        'input-bg': '#F9FAFB',
        'input-border': '#CBD5E0', // Darker border
        'border-color': '#CBD5E0', // Enhanced borders for more contrast
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 