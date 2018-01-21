'use strict';

const path = require('path');

const server = path.resolve(process.cwd(), 'src/server/index.js');

process.env.NODE_ENV = 'production';

// eslint-disable-next-line import/no-dynamic-require
require(server);
