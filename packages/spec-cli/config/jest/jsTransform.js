const path = require('path');
const paths = require('../../config/paths');
const { createTransformer } = require('babel-jest');

const projectRoot = path.resolve(__dirname, '../../');

const babelOptions = {
  // presets: ['@spec/babel-preset-spec/test'],
  // presets: [
  // [
  // 'env',
  // {
  // targets: {
  // node: 'current',
  // },
  // },
  // ],
  // 'stage-2',
  // 'react',
  // 'flow',
  // ],
  // plugins: [
  // 'dynamic-import-node',
  // [
  // 'module-resolver',
  // {
  // root: [paths.appSrc],
  // },
  // ],
  // ],
};

module.exports = createTransformer(babelOptions);
