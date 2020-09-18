module.exports = {
  purge: {
    enabled: false,
    content: [
      './src/**/*.html',
      './src/**/*.vue',
    ],
  },
  theme: {
    extend: {},
  },
  variants: {
    opacity: ['active'],
    scale: ['active'],
    border: ['focus']
  },
  plugins: [
    require('@tailwindcss/ui'),
  ],
}
