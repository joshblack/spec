'use strict';

module.exports = {
  presets: [
    [
      'env',
      {
        modules: false,
        targets: {
          browsers: ['last 1 version', 'ie >= 11'],
        },
      },
    ],
    'stage-1',
    'react',
    'flow',
  ],
};
