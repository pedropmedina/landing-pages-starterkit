const purgecss = require('@fullhuman/postcss-purgecss')({
  // Specify the paths to all of the template files in your project
  content: ['./src/**/*.html', './src/**/*.hbs'],
  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

module.exports = ({ options }) => ({
  plugins: [
    require('stylelint')('./stylelint.config.js'),
    require('tailwindcss')('./tailwind.config.js'),
    require('autoprefixer'),
    ...(options.mode === 'production' ? [purgecss] : [])
  ]
});
