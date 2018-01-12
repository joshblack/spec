'use strict';

import { generateScriptMarkupFor } from '../server';

describe('segment server', () => {
  it('should generate the script markup for a valid key', () => {
    expect(generateScriptMarkupFor('abcd')).toMatchSnapshot();
  });
});
