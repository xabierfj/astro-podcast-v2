module.exports = {
  extends: ['stylelint-config-tailwindcss'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['theme'],
      },
    ],
  },
};