'use strict';

const path = require('path');

module.exports = ({ api }) => {
  api.add(async ({ addDependencies, addPlugins, copy, extendPackageJson }) => {
    console.log('Adding files from `@spec/cli-plugin-service`');

    await copy([path.join(__dirname, './files')]);

    await addDependencies([
      {
        pkg: '@spec/server',
        type: 'dependency',
        useLink: true,
      },
      {
        pkg: 'cross-env',
        type: 'dependency',
      },
      {
        pkg: 'dotenv',
        type: 'dependency',
      },
      {
        pkg: 'express',
        type: 'dependency',
      },
      {
        pkg: 'prop-types',
        type: 'dependency',
      },
      {
        pkg: 'react',
        type: 'dependency',
      },
      {
        pkg: 'react-dom',
        type: 'dependency',
      },
      {
        pkg: 'react-hot-loader',
        type: 'dependency',
      },
    ]);

    await extendPackageJson(({ cliPath, npmClient, packageJson }) => {
      return {
        scripts: {
          ...packageJson.scripts,
          start: 'cross-env NODE_ENV=production node src/server/index.js',
        },
      };
    });
  });
};
