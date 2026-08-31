/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617',
          },
          navy: {
            800: '#1e3a8a',
            900: '#172554',
            950: '#0b132b',
          }
        },
        risk: {
          low: {
            DEFAULT: '#16a34a', // green-600
            light: '#dcfce7',   // green-100
            border: '#86efac',  // green-300
            dark: '#15803d',    // green-700
            bg: '#f0fdf4',      // green-50
          },
          moderate: {
            DEFAULT: '#d97706', // amber-600
            light: '#fef3c7',   // amber-100
            border: '#fcd34d',  // amber-300
            dark: '#b45309',    // amber-700
            bg: '#fffbeb',      // amber-50
          },
          high: {
            DEFAULT: '#ea580c', // orange-600
            light: '#ffedd5',   // orange-100
            border: '#fdba74',  // orange-300
            dark: '#c2410c',    // orange-700
            bg: '#fff7ed',      // orange-50
          },
          critical: {
            DEFAULT: '#dc2626', // red-600
            light: '#fee2e2',   // red-100
            border: '#fca5a5',  // red-300
            dark: '#b91c1c',    // red-700
            bg: '#fef2f2',      // red-50
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
