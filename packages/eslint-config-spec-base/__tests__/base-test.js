/**
 * (C) Copyright IBM Corp. 2017 All Rights Reserved
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has
 * been deposited with the U.S. Copyright Office.
 */

const path = require('path');

describe('eslint-config-watson-base', () => {
  let CLIEngine;

  beforeEach(() => {
    CLIEngine = require('eslint').CLIEngine;
  });

  it('should be able to parse source text with our defined rules', () => {
    const cli = new CLIEngine({
      configFile: path.resolve(__dirname, '../.eslintrc'),
      useEslintrc: false,
    });

    const report = cli.executeOnText('var foo');

    expect(report.results).toBeDefined();
    expect(report.errorCount).not.toBe(0);
  });
});
