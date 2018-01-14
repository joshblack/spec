/*       */

'use strict';

const fs = require('fs');
const path = require('path');
const webpackConfig = require('@spec/config/webpack/webpack.config.dev');
const errorf = require('./errorf');

const DEV_BUNDLE_ENTRY = '@@bundle.js';

const getBuildContext = assetPath => {
  if (process.env.NODE_ENV === 'development') {
    // This information is derived from the specific Webpack config file that
    // we end up using.
    const context = {
      assets: assetPath,
      manifest: {
        [DEV_BUNDLE_ENTRY]: webpackConfig.output.filename,
      },
    };

    return context;
  }

  const manifestPath = path.join(assetPath, 'asset-manifest.json');
  try {
    const rawManifest = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(rawManifest);
    const context = {
      assets: assetPath,
      manifest,
    };
    return context;
  } catch (error) {
    return errorf(
      error,
      'Unable to read asset-manifest.json at path %s.',
      manifestPath
    );
  }
};

module.exports = exports = getBuildContext;
exports.DEV_BUNDLE_ENTRY = DEV_BUNDLE_ENTRY;
