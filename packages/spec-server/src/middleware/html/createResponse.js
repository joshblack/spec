/* @flow */

'use strict';

const createHead = require('./createHead');
const createBody = require('./createBody');

type CreateResponseConfig = {|
  +manifest: { [key: string]: string },
  +runtime?: string,
  +getTitle: (req: any) => string,
|};

const createResponse = ({
  manifest,
  runtime,
  getTitle,
}: CreateResponseConfig) => (req: any, res: any) => {
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
