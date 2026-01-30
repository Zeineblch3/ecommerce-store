/** @type {import('tailwindcss').Config} */
export const content = [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
];
export const theme = {
    extend: {
        animation: {
            'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
    },
};
export const plugins = [];
