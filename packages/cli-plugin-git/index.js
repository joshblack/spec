'use strict';

const fs = require('fs-extra');
const path = require('path');
const spawn = require('@spec/cli-tools/spawn');

module.exports = ({ api, env }) => {
  api.add(async ({ addDependencies, extendPackageJson }) => {
    // TODO should have option for whether or not to initialize git
    if (!(await fs.exists(path.join(env.cwd, '.git')))) {
      await spawn('git', ['init'], {
        cwd: env.cwd,
      });
    }

    await addDependencies([
      {
        pkg: '@commitlint/cli',
        type: 'devDependency',
      },
      {
        pkg: '@commitlint/config-conventional',
        type: 'devDependency',
      },
      {
        pkg: 'husky',
        type: 'devDependency',
      },
      {
        pkg: 'lint-staged',
        type: 'devDependency',
      },
    ]);

    await extendPackageJson(({ packageJson: remotePackageJson }) => {
      return {
        ...remotePackageJson,
        scripts: {
          ...remotePackageJson.scripts,
          commitmsg: 'commitlint -e $GIT_PARAMS',
          precommit: 'lint-staged',
        },
        commitlint: {
          extends: ['@commitlint/config-conventional'],
        },
        'lint-staged': {
          '*.{scss,css,js,md}': ['yarn format', 'git add'],
        },
      };
    });
  });
};
