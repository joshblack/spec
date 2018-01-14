/**
 * @jest-environment node
 */

'use strict';

describe('validate-template middleware', () => {
  let middleware;
  let mockProgram;
  let mockNext;
  let mockValidTemplates;

  beforeEach(() => {
    mockProgram = {};
    mockNext = jest.fn();
    mockValidTemplates = new Set(['a', 'b', 'c']);

    jest.mock('../../templates', () => mockValidTemplates);
    middleware = require('../validate-template');
  });

  it('should call `next` if an invalid template is passed in', () => {
    mockProgram.template = 'd';
    middleware(mockProgram, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
