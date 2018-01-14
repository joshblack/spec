/*       */

'use strict';

const createHead = require('./createHead');
const createBody = require('./createBody');

const createResponse = ({ manifest, runtime, getTitle }) => (req, res) => {
  const earlyChunk = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    createHead(manifest, runtime, getTitle(req)),
  ].join('');

  res.set('Content-Type', 'text/html; charset=utf-8');
  res.write(earlyChunk);
  res.flush();

  const lateChunk = [createBody(manifest), '</html>'].join('');

  res.write(lateChunk);
  res.flush();
  res.end();
};

module.exports = exports = createResponse;
