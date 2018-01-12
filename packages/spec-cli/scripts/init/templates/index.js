'use strict';

const fs = require('fs');
const templates = fs.readdirSync(__dirname).filter(file => file !== 'index.js');

module.exports = new Set(templates);
