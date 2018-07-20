'use strict';

describe('DeferredWriteStore', () => {
  let DeferredWriteStore;

  beforeEach(() => {
    DeferredWriteStore = require('../DeferredWriteStore');
  });

  it('should not set a value until the first read', async () => {
    const dw = new DeferredWriteStore();
    const mockValue = 'a';
    const writer = jest.fn(() => mockValue);
    dw.write('a', writer);

    expect(writer).not.toHaveBeenCalled();

    const value = await dw.read('a');

    expect(writer).toHaveBeenCalledTimes(1);
    expect(value).toBe(mockValue);
  });

  it('should not recompute a value if the writers have not changed', async () => {
    const dw = new DeferredWriteStore();
    const writerA = jest.fn(() => 'a');
    const writerB = jest.fn(() => 'b');
    const writerC = jest.fn(() => 'c');

    dw.write('a', writerA);
    dw.write('a', writerB);

    await dw.read('a');
    await dw.read('a');

    expect(writerA).toHaveBeenCalledTimes(1);
    expect(writerB).toHaveBeenCalledTimes(1);

    dw.write('a', writerC);

    await dw.read('a');

    expect(writerA).toHaveBeenCalledTimes(2);
    expect(writerB).toHaveBeenCalledTimes(2);
    expect(writerC).toHaveBeenCalledTimes(1);
  });
});
