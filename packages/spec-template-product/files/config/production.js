'use strict';

const { HOST, PORT } = process.env;

module.exports = {
  HOST,
  NODE_ENV: 'production',
  PORT,
  PROTOCOL: 'http',
};
