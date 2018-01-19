/**
 * (C) Copyright IBM Corp. 2017 All Rights Reserved
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has
 * been deposited with the U.S. Copyright Office.
 */

'use strict';

module.exports = {
  extends: [
    'eslint-config-spec-base',
    './plugins/react-a11y',
    './plugins/react',
  ].map(require.resolve),
  rules: {},
};
