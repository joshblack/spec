/**
 * @jest-environment node
 */

'use strict';

describe('map-default middleware', () => {
  let middleware;
  let mockProgram;

  beforeEach(() => {
    middleware = require('../map-default');
    mockProgram = {};
  });

  it('should re-map `default` to `product`', () => {
    mockProgram.template = 'default';
    middleware(mockProgram);
    expect(mockProgram.template).toBe('product');
  });

  it('should leave non-`default` alone', () => {
    mockProgram.template = 'foo';
    middleware(mockProgram);
    expect(mockProgram.template).toBe(mockProgram.template);
  });
});
