/* @flow */

'use strict';

const winston = require('winston');

const level =
  process.env.SERVICE_LOG_LEVEL !== null
    ? process.env.SERVICE_LOG_LEVEL
    : 'info';
const handleExceptions =
  process.env.NODE_ENV !== null ? process.env.NODE_ENV : 'development';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level,
      handleExceptions,
      timestamp: () => {
        const now = new Date();

        return `[${now.toISOString()}]`;
      },
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
