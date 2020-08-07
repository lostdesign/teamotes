module.exports = {
    purge: {
      enabled: true, //process.env.NODE_ENV === 'production',
      content: [
        './src/**/*.html', 
        './src/**/*.vue',
      ],
    },
    theme: {
      extend: {},
    },
    variants: {},
    plugins: [
      require('@tailwindcss/ui'),
    ],
  }
  