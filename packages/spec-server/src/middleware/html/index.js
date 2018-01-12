/* @flow */

'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const createResponse = require('./createResponse');

import type { Server, Context } from '../../types';

type HtmlMiddlewareConfig = {|
  getTitle: (req: any) => string,
|};

module.exports = (
  {
    // TODO: Analytics Key
    getTitle = () => 'Ocelot App',
  }: // TODO: og:* properties
  // getOpenGraphInfo = (req, title) => ({
  // title,
  // site_name: '',
  // image: '',
  // description: '',
  // url: req.url,
  // }),
  HtmlMiddlewareConfig = {}
) => (server: Server, context: Context): Promise<Server> => {
  const { build } = context;
  const { assets, manifest } = build;

  return Promise.resolve()
    .then(() => {
      if (manifest['runtime.js'] !== undefined) {
        return readFile(path.join(assets, manifest['runtime.js']), 'utf8');
      }
    })
    .then(rawRuntime => {
      if (rawRuntime !== undefined) {
        // Update the sourceMappingURL for the runtime since we embed it in the
        // payload
        const runtime = rawRuntime.replace(
          /(sourceMappingURL=)(runtime)/,
          '$1/static/js/runtime'
        );
        return runtime;
      }
    })
    .then(runtime => {
      server.get(
        '*',
        createResponse({
          manifest,
          runtime,
          getTitle,
        })
      );

      return server;
    });
};
