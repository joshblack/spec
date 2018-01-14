'use strict';

global.requestAnimationFrame = function requestAnimationFrame(cb) {
  setTimeout(cb, 0);
};

jest.unmock('promise');
jest.unmock('whatwg-fetch');
jest.unmock('object-assign');

require('../polyfills');

const enzyme = require.requireActual('enzyme');
const Adapter = require.requireActual('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });
