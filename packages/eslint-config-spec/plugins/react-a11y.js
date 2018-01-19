'use strict';

module.exports = {
  extends: ['plugin:jsx-a11y/strict'],
  plugins: ['jsx-a11y', 'react'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};
