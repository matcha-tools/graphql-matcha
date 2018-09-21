'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getObjectsFromUrls = exports.getObjectsByType = exports.getObjectFromTypeAndId = exports.getObjectFromUrl = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

/**
 * Given an object URL, fetch it, append the ID to it, and return it.
 */
var getObjectFromUrl = exports.getObjectFromUrl = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(url) {
    var data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return localUrlLoader.load(url);

          case 2:
            data = _context.sent;
            return _context.abrupt('return', objectWithId(data));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getObjectFromUrl(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Given a type and ID, get the object with the ID.
 */


var getObjectFromTypeAndId = exports.getObjectFromTypeAndId = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(type, id) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getObjectFromUrl('https://swapi.co/api/' + type + '/' + id + '/');

          case 2:
            return _context2.abrupt('return', _context2.sent);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getObjectFromTypeAndId(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Given a type, fetch all of the pages, and join the objects together
 */
var getObjectsByType = exports.getObjectsByType = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(type) {
    var objects, nextUrl, pageData;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            objects = [];
            nextUrl = 'https://swapi.co/api/' + type + '/';

          case 2:
            if (!nextUrl) {
              _context3.next = 10;
              break;
            }

            _context3.next = 5;
            return localUrlLoader.load(nextUrl);

          case 5:
            pageData = _context3.sent;

            objects = objects.concat(pageData.results.map(objectWithId));
            nextUrl = pageData.next;
            _context3.next = 2;
            break;

          case 10:
            objects = sortObjectsById(objects);
            return _context3.abrupt('return', { objects: objects, totalCount: objects.length });

          case 12:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getObjectsByType(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var getObjectsFromUrls = exports.getObjectsFromUrls = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(urls) {
    var array;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _promise2.default.all(urls.map(getObjectFromUrl));

          case 2:
            array = _context4.sent;
            return _context4.abrupt('return', sortObjectsById(array));

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getObjectsFromUrls(_x5) {
    return _ref4.apply(this, arguments);
  };
}();

exports.convertToNumber = convertToNumber;

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

var _api = require('../api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2015-present, Facebook Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *
 *  strict
 */

var localUrlLoader = new _dataloader2.default(function (urls) {
  return _promise2.default.all(urls.map(_api.getFromLocalUrl));
});

/**
 * Objects returned from SWAPI don't have an ID field, so add one.
 */
function objectWithId(obj) {
  obj.id = parseInt(obj.url.split('/')[5], 10);
  return obj;
}

function sortObjectsById(array) {
  return array.sort(function (a, b) {
    return a.id - b.id;
  });
}

/**
 * Given a string, convert it to a number
 */
function convertToNumber(value) {
  if (['unknown', 'n/a'].indexOf(value) !== -1) {
    return null;
  }
  // remove digit grouping
  var numberString = value.replace(/,/, '');
  return Number(numberString);
}