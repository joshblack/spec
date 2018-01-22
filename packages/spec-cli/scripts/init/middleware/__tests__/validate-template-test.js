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
    mockValidTemplates = new Map([['a', {}], ['b', {}]]);
    mockValidTemplates.recommendedTemplates = ['a'];

    jest.mock('@spec/templates', () => mockValidTemplates);
    middleware = require('../validate-template');
  });

  it('should call `next` if an invalid template is passed in', () => {
    mockProgram.template = 'd';
    middleware(mockProgram, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
