module.exports = {
    purge: {
      enabled: true,
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
      scale: ['active']
    },
    plugins: [
      require('@tailwindcss/ui'),
    ],
  }
  