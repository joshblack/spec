'use strict';

const path = require('path');
const express = require('express');
const applyMiddleware = require('@spec/server/tools/applyMiddleware');
const getBuildContext = require('@spec/server/tools/getBuildContext');

const middleware = [
  // Development Middleware for handling client-side related development
  require('@spec/server/middleware/development'),

  // Middleware that should be enabled for all requests
  require('@spec/server/middleware/all'),

  // "Security" middleware
  require('@spec/server/middleware/security')(),

  // Handle serving static assets provided through ASSET_PATH
  require('@spec/server/middleware/static'),

  // Handle generating HTML responses, serving static assets, and error handling
  require('@spec/server/middleware/html')({
    // Accepts `req` as a parameter from the express middleware handler
    getTitle: () => 'Spec App',
  }),

  // Error handling so we don't pollute the response with stack traces
  require('@spec/server/middleware/error'),
];

const ASSET_PATH = path.resolve(__dirname, '../../build');
const server = express();
const context = {
  build: getBuildContext(ASSET_PATH),
};

module.exports = () => applyMiddleware(server, middleware, context);
