'use strict';

module.exports = () => {
  const config = {
    collectCoverageFrom: ['src/**/*.js'],
    setupFiles: [require.resolve('@spec/config/jest/setup.js')],
    testMatch: [
      '<rootDir>/**/__tests__/**/*.js?(x)',
      '<rootDir>/**/?(*.)(spec|test).js?(x)',
    ],
    transform: {
      '^.+\\.(js|jsx)$': require.resolve('@spec/config/jest/jsTransform.js'),
      '^.+\\.css$': require.resolve('@spec/config/jest/cssTransform.js'),
      '^(?!.*\\.(js|jsx|css|json)$)': require.resolve(
        '@spec/config/jest/fileTransform.js'
      ),
    },
    testPathIgnorePatterns: ['/config/', '/lib/'],
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleFileExtensions: ['js', 'json'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
  };

  return config;
};
