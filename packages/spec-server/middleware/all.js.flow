/* @flow */

'use strict';

const morgan = require('morgan');
const bodyParser = require('body-parser');
const applyMiddleware = require('../tools/applyMiddleware');

import type { Server, Context, Middleware } from '../types';

module.exports = (server: Server, context: Context): Server => {
  // Middleware to apply before anything else
  const middleware: Array<Middleware> = [];

  server.disable('x-powered-by');

  return applyMiddleware(server, middleware, context).then(server => {
    // Logging middleware
    server.use(morgan('tiny'));

    // Enable GZIP by default
    server.use(require('compression')());
    server.use(bodyParser.json({ limit: 2 ** 21 /* 2MB */ }));

    return server;
  });
};
