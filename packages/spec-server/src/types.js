/* @flow */

'use strict';

import type { BuildContext } from './tools/getBuildContext';

export type Server = any;

export type Middleware = (
  server: Server,
  context: Context
) => Promise<Server> | Server;

export type Context = {|
  +build: BuildContext,
|};

export type ErrorMessage = {|
  +status?: number,
  +title: string,
  +details?: Array<string>,
|};

export type ErrorResponse = {|
  +errors: Array<ErrorMessage>,
|};
