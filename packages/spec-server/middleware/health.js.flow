/* @flow */

'use strict';

import type { Server } from '../types';

const healthCheckHandler = (req, res) => {
  res.status(200).send('OK');
};

module.exports = (server: Server): Server => {
  server.use('/api/health', healthCheckHandler);
  return server;
};

module.exports.healthCheckHandler = healthCheckHandler;
