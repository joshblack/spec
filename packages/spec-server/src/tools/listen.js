/* @flow */

'use strict';

const config = require('config');
const logger = require('./logger');
const setupHTTPSServer = require('./setupHTTPSServer');

import type { Server } from '../types';

const listen = (server: Server): Promise<*> => {
  const { HOST, PROTOCOL, PORT } = config;
  const service =
    PROTOCOL === 'https' && HOST === 'localhost'
      ? setupHTTPSServer(server)
      : server;

  return new Promise((resolve, reject) => {
    const handler = service.listen(PORT, HOST, 511, error => {
      if (error) {
        reject(error);
        return;
      }
      resolve(handler);
      logger.info(`Server listening at ${PROTOCOL}://${HOST}:${PORT}`);
    });
  });
};

module.exports = listen;
