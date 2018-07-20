/**
 * @jest-environment node
 */

'use strict';

// const config = await Config.load(root);
// config.addPlugin();
// config.removePlugin();

describe('Config', () => {
  let Config;

  beforeEach(() => {
    Config = require('../Config');
  });

  // describe('search', () => {
  // // await Config.search('spec')
  // it('should return an instance of Config', async () => {
  // expect((await Config.search()) instanceof Config).toBe(true);
  // });

  // it('should throw if it cannot find any configuration options', () => {
  // // ...
  // });
  // });

  describe('load', () => {
    let name;

    beforeEach(() => {
      name = '@spec/cli';
    });

    // const config = await Config.load('spec')
    it('should return an instance of Config', async () => {
      expect((await Config.load(name)) instanceof Config).toBe(true);
    });

    it('should throw if it cannot find any configuration options', () => {
      // ...
    });
  });

  describe('#addPlugin', () => {
    // const config = await Config.load('spec');
    // config.addPlugin('@spec/cli-plugin-develop');
  });

  describe('#removePlugin', () => {
    // const config = await Config.load('spec');
    // config.removePlugin('@spec/cli-plugin-develop');
  });

  describe('plugins', () => {
    // const config = await Config.load('spec');
    // config.plugins
  });
});
