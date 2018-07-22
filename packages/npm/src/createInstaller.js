'use strict';

const spawn = require('@spec/cli-tools/spawn');

/**
 * @typedef Package
 * @property {string} name the name of the package
 * @property {string} version the version of the package
 */

/**
 * Create an installer for production and development dependencies.
 *
 * @param {string} npmClient the client to use for the install commands
 * @param {string} cwd the directory where you run the command
 * @param {string} installCommand the command to use to install dependencies for
 * the client
 * @param {string} saveFlag the flag used to save the dependencies in the
 * client's lockfile
 * @returns {Function}
 */
function createInstaller(npmClient, cwd, installCommand, saveFlag) {
  /**
   * Runs the install command for the given packages
   *
   * @param {Array<Package|string>} packages
   * @param {Object} options
   * @returns {Promise}
   */
  return function installer(packages, { stdio = 'inherit', ...rest } = {}) {
    const dependencies = packages.map(pkg => {
      if (typeof pkg === 'string') {
        return pkg;
      }
      if (installCommand === 'link') {
        return pkg.name;
      }
      return `${pkg.name}@${pkg.version}`;
    });
    const args = [installCommand, ...dependencies, saveFlag].filter(Boolean);
    return spawn(npmClient, args, {
      cwd,
      stdio,
      ...rest,
    });
  };
}

module.exports = createInstaller;
