'use strict';

module.exports = {
  extends: [
    'eslint-config-spec-base',
    './plugins/react-a11y',
    './plugins/react',
  ].map(require.resolve),
  rules: {},
};
