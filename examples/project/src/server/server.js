'use strict';

const path = require('path');
const express = require('express');
const applyMiddleware = require('@spec/server/tools/applyMiddleware');
const getBuildContext = require('@spec/server/tools/getBuildContext');

const middleware = [
  // Secure middleware for redirecting to HTTPS, when applicable
  require('@spec/server/middleware/secure'),

  // Middleware that should be enabled for most requests
  require('@spec/server/middleware/all'),

  // Development Middleware for handling client-side related development
  require('@spec/server/middleware/development'),

  // "Security" middleware
  require('@spec/server/middleware/security')(),

  // Handle serving static assets provided through ASSET_PATH
  require('@spec/server/middleware/static'),

  // Handle generating HTML responses, serving static assets, and error handling
  require('@spec/server/middleware/html')({
    getTitle: () => 'Example Project',
    getMetaTags: () => ({
      og: {
        title: 'Example Project',
        type: 'website',
        description: 'Example Project',
      },
    }),
  }),

  // Error handling so we don't pollute the response with stack traces
  require('@spec/server/middleware/error'),
];

module.exports = async () => {
  const server = express();
  const ASSET_PATH = path.resolve(__dirname, '../../build');
  const context = {
    build: await getBuildContext(ASSET_PATH),
  };
  return applyMiddleware(server, middleware, context);
};
