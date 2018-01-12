'use strict';

const path = require('path');
const express = require('express');
const applyMiddleware = require('@ocelot/server/lib/tools/applyMiddleware');
const getBuildContext = require('@ocelot/server/lib/tools/getBuildContext');

const middleware = [
  // Development Middleware for handling client-side related development
  require('@ocelot/server/lib/middleware/development'),

  // Middleware that should be enabled for all requests
  require('@ocelot/server/lib/middleware/all'),

  // "Security" middleware
  require('@ocelot/server/lib/middleware/security'),

  // Handle serving static assets provided through ASSET_PATH
  require('@ocelot/server/lib/middleware/static'),

  // Handle generating HTML responses, serving static assets, and error handling
  require('@ocelot/server/lib/middleware/html')({
    // Accepts `req` as a parameter from the express middleware handler
    getTitle: () => 'Ocelot App',
  }),

  // Error handling so we don't pollute the response with stack traces
  require('@ocelot/server/lib/middleware/error'),
];

const ASSET_PATH = path.resolve(__dirname, '../../build');
const server = express();
const context = {
  build: getBuildContext(ASSET_PATH),
};

module.exports = () => applyMiddleware(server, middleware, context);
