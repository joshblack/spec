'use strict';

module.exports = {
  presets: [
    [
      'env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    'stage-1',
    'react',
    'flow',
  ],
  plugins: ['dynamic-import-node'],
};
