/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border, 0 0% 90%) / <alpha-value>)',
        ring: 'hsl(var(--ring, 0 0% 80%) / <alpha-value>)',
        background: 'hsl(var(--background, 0 0% 100%) / <alpha-value>)',
        foreground: 'hsl(var(--foreground, 0 0% 10%) / <alpha-value>)',
        popover: {
          foreground: 'hsl(var(--popover-foreground, 0 0% 100%) / <alpha-value>)',
          background: 'hsl(var(--popover-background, 0 0% 10%) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}
