/**
 * (C) Copyright IBM Corp. 2017 All Rights Reserved
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has
 * been deposited with the U.S. Copyright Office.
 *
 * @noflow
 */

'use strict';

const uuid = require('uuid/v4');

const requestId = (req, res, next) => {
  if (req._id) {
    return next();
  }
  req._id = req.get('x-request-id') || uuid();
  return next();
};

module.exports = exports = server => {
  server.use(requestId);
  return server;
};

exports.requestId = requestId;
