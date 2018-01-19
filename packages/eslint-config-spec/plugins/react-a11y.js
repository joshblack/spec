/**
 * (C) Copyright IBM Corp. 2017 All Rights Reserved
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has
 * been deposited with the U.S. Copyright Office.
 */

'use strict';

module.exports = {
  extends: ['plugin:jsx-a11y/strict'],
  plugins: ['jsx-a11y', 'react'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};
