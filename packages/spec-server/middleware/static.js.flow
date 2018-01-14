/* @flow */

'use strict';

const path = require('path');
const express = require('express');

import type { Server, Context } from '../types';

module.exports = (server: Server, context: Context): Server => {
  if (process.env.NODE_ENV === 'development') {
    return server;
  }

  const { build } = context;
  const staticPath = path.join(build.assets, 'static');

  // Serve our build assets with an aggressive cache policy duration
  server.use('/static', express.static(staticPath, { maxAge: 31536000000 }));

  // Serve assets that don't require, or don't want, an aggressive cache policy
  server.use(express.static(build.assets));

  return server;
};
