/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0066CC',
                    50: '#E6F0FA',
                    100: '#CCE0F5',
                    200: '#99C2EB',
                    300: '#66A3E0',
                    400: '#3385D6',
                    500: '#0066CC',
                    600: '#0052A3',
                    700: '#003D7A',
                    800: '#002952',
                    900: '#001429',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
