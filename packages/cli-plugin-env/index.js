'use strict';

const getClientEnvironment = require('./getClientEnvironment');

module.exports = ({ api, options }) => {
  api.extend('env', () => getClientEnvironment(options));
};
