'use strict';

const path = require('path');

/**
 * @param {string} string The path to resolve
 * @returns {Function | Object} The module that is required
 */
async function resolve(string) {
  if (isPathString(string)) {
    const source = path.resolve(string);
    return require(source);
  }
  return require(string);
}

function isPathString(string) {
  return string[0] === '.' || string[0] === '/';
}

module.exports = resolve;
