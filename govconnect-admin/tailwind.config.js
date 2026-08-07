/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Near-black brand surface (landing hero, sidebar, dark panels)
        ink: {
          DEFAULT: '#111318',
          950: '#0A0C10',
          900: '#0D1017',
          800: '#12151D',
          700: '#1A1E29',
        },
        // Vivid orange — the single accent color, used everywhere primary
        brand: {
          DEFAULT: '#FF6A2B',
          dark: '#E85A1E',
          soft: '#FFE7D9',
        },
        paper: '#F4F5F7',
        line: '#E7E8EC',
        // Status palette used across badges/pills
        status: {
          gray: '#6B7280',
          graySoft: '#EEEFF2',
          blue: '#2563EB',
          blueSoft: '#DCE7FD',
          amber: '#D97706',
          amberSoft: '#FCEED8',
          green: '#15803D',
          greenSoft: '#DDF2E4',
          red: '#DC2626',
          redSoft: '#FBE1DF',
        },
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
