'use strict';

const fs = require('fs');
const blacklist = new Set([
  '.gitignore',
  '.DS_Store',
  'node_modules',
  'index.js',
  '.npmignore',
]);
const templates = fs
  .readdirSync(__dirname)
  .filter(file => !blacklist.has(file));

module.exports = new Set(templates);
