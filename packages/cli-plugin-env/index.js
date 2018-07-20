'use strict';

const getClientEnvironment = require('./getClientEnvironment');

module.exports = ({ api }) => {
  api.extend('env', () => ({
    getClientEnvironment,
  }));
};
