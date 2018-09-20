'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFromLocalUrl = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Given a URL of an object in the SWAPI, return the data
 * from our local cache.
 */
var getFromLocalUrl = exports.getFromLocalUrl = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(url) {
    var text;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            text = _data2.default[url];

            if (text) {
              _context.next = 3;
              break;
            }

            throw new Error('No entry in local cache for ' + url);

          case 3:
            if (process.env.NODE_ENV !== 'test') {
              // eslint-disable-next-line no-console
              console.log('Hit the local cache for ' + url + '.');
            }
            return _context.abrupt('return', text);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getFromLocalUrl(_x) {
    return _ref.apply(this, arguments);
  };
}(); /**
      * Copyright (c) 2015-present, Facebook, Inc.
      * All rights reserved.
      *
      * This source code is licensed under the license found in the
      * LICENSE-examples file in the root directory of this source tree.
      *
      *  strict
      */

var _data = require('../cache/data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }