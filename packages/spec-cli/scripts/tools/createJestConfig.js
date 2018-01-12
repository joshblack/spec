'use strict';

module.exports = resolve => {
  const config = {
    collectCoverageFrom: ['src/**/*.js'],
    setupFiles: [resolve('config/jest/polyfills.js')],
    testMatch: [
      '<rootDir>/**/__tests__/**/*.js?(x)',
      '<rootDir>/**/?(*.)(spec|test).js?(x)',
    ],
    transform: {
      '^.+\\.(js|jsx)$': resolve('config/jest/jsTransform.js'),
      '^.+\\.css$': resolve('config/jest/cssTransform.js'),
      '^(?!.*\\.(js|jsx|css|json)$)': resolve('config/jest/fileTransform.js'),
    },
    testPathIgnorePatterns: ['/config/', '/lib/'],
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleFileExtensions: ['js', 'json'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
  };

  return config;
};
