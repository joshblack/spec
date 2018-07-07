'use strict';

const program = require('commander');
const Coordinator = require('./Coordinator');

module.exports = {
  Coordinator: new Coordinator('spec', process.cwd(), program),
};
