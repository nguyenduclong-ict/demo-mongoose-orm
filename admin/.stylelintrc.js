module.exports = {
  plugins: ['stylelint-scss'],
  configBasedir: '.',
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
  },
}
