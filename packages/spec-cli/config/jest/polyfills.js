'use strict';

jest.unmock('promise');
jest.unmock('whatwg-fetch');
jest.unmock('object-assign');

require('../polyfills');
