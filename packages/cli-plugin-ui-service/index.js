'use strict';

const path = require('path');

module.exports = ({ api }) => {
  api.add(
    async ({
      copy,
      extendPackageJson,
      installDependencies,
      linkDependencies,
    }) => {
      console.log('Adding files from `@spec/cli-plugin-service`');

      await copy([path.join(__dirname, './files')]);

      await linkDependencies(['@spec/server']);
      await installDependencies([
        'cross-env',
        'dot-env',
        'express',
        'prop-types',
        'react',
        'react-dom',
        'react-hot-loader',
      ]);

      await extendPackageJson(({ cliPath, npmClient, packageJson }) => {
        return {
          scripts: {
            ...packageJson.scripts,
            start: 'cross-env NODE_ENV=production node src/server/index.js',
          },
        };
      });
    }
  );
};
