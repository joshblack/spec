'use strict';

const register = require('@ocelot/server/lib/tools/register');
const setupServer = require('./server');

register(setupServer);
