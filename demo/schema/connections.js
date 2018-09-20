'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.connectionFromUrls = connectionFromUrls;

var _graphqlRelay = require('graphql-relay');

var _apiHelper = require('./apiHelper');

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constructs a GraphQL connection field config; it is assumed
 * that the object has a property named `prop`, and that property
 * contains a list of URLs.
 */
function connectionFromUrls(name, prop, type) {
  var _this = this;

  var _connectionDefinition = (0, _graphqlRelay.connectionDefinitions)({
    name: name,
    nodeType: type,
    resolveNode: function resolveNode(edge) {
      return edge.node;
    },
    connectionFields: function connectionFields() {
      return (0, _defineProperty3.default)({
        totalCount: {
          type: _graphql.GraphQLInt,
          resolve: function resolve(conn) {
            return conn.totalCount;
          },
          description: 'A count of the total number of objects in this connection, ignoring pagination.\nThis allows a client to fetch the first five objects by passing "5" as the\nargument to "first", then fetch the total count so it could display "5 of 83",\nfor example.'
        }
      }, prop, {
        type: new _graphql.GraphQLList(type),
        resolve: function resolve(conn) {
          return conn.edges.map(function (edge) {
            return edge.node;
          });
        },
        description: 'A list of all of the objects returned in the connection. This is a convenience\nfield provided for quickly exploring the API; rather than querying for\n"{ edges { node } }" when no edge data is needed, this field can be be used\ninstead. Note that when clients like Relay need to fetch the "cursor" field on\nthe edge to enable efficient pagination, this shortcut cannot be used, and the\nfull "{ edges { node } }" version should be used instead.'
      });
    }
  }),
      connectionType = _connectionDefinition.connectionType;

  return {
    type: connectionType,
    args: _graphqlRelay.connectionArgs,
    resolve: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(obj, args) {
        var array;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _apiHelper.getObjectsFromUrls)(obj[prop] || []);

              case 2:
                array = _context.sent;
                return _context.abrupt('return', (0, _extends3.default)({}, (0, _graphqlRelay.connectionFromArray)(array, args), {
                  totalCount: array.length
                }));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      function resolve(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return resolve;
    }()
  };
} /**
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the license found in the
   * LICENSE-examples file in the root directory of this source tree.
   *
   *  strict
   */