'use strict';

module.exports = {
  plugins: [
    '@spec/cli-plugin-env',
    '@spec/cli-plugin-paths',
    '@spec/cli-plugin-webpack',
    '@spec/cli-plugin-develop',
    '@spec/cli-plugin-build',
    [
      '@spec/cli-plugin-format',
      {
        jsxBracketSameLine: true,
        printWidth: 80,
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
  ],
};
