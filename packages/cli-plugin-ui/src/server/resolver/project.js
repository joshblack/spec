'use strict';

const path = require('path');

exports.create = async function create() {
  return {
    name: (args, context) => {
      const { cwd } = context;
      return path.basename(cwd);
    },
    relative: (args, context) => {
      const { cwd } = context;
      return path.relative(
        process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
        cwd
      );
    },
    path: (args, context) => {
      return context.cwd;
    },
  };
};
