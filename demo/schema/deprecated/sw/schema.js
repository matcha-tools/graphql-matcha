"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _graphql = require("graphql");
const { GraphQLSchema } = require("graphql");

var _graphqlRelay = require("graphql-relay");

var _apiHelper = require("./apiHelper");

var _relayNode = require("./relayNode");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Creates a root field to get an object of a given type.
 * Accepts either `id`, the globally unique ID used in GraphQL,
 * or `idName`, the per-type ID used in SWAPI.
 */
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *
 *  strict
 */

function rootFieldByID(idName, swapiType) {
  var getter = function getter(id) {
    return (0, _apiHelper.getObjectFromTypeAndId)(swapiType, id);
  };
  var argDefs = {};
  argDefs.id = { type: _graphql.GraphQLID };
  argDefs[idName] = { type: _graphql.GraphQLID };
  return {
    type: (0, _relayNode.swapiTypeToGraphQLType)(swapiType),
    args: argDefs,
    resolve: function resolve(_, args) {
      if (args[idName] !== undefined && args[idName] !== null) {
        return getter(args[idName]);
      }

      if (args.id !== undefined && args.id !== null) {
        var globalId = (0, _graphqlRelay.fromGlobalId)(args.id);
        if (
          globalId.id === null ||
          globalId.id === undefined ||
          globalId.id === ""
        ) {
          throw new Error("No valid ID extracted from " + args.id);
        }
        return getter(globalId.id);
      }
      throw new Error("must provide id or " + idName);
    }
  };
}

/**
 * Creates a connection that will return all objects of the given
 * `swapiType`; the connection will be named using `name`.
 */
function rootConnection(name, swapiType) {
  var _this = this;

  var graphqlType = (0, _relayNode.swapiTypeToGraphQLType)(swapiType);

  var _connectionDefinition = (0, _graphqlRelay.connectionDefinitions)({
      name: name,
      nodeType: graphqlType,
      connectionFields: function connectionFields() {
        return (0, _defineProperty3.default)(
          {
            totalCount: {
              type: _graphql.GraphQLInt,
              resolve: function resolve(conn) {
                return conn.totalCount;
              },
              description:
                'A count of the total number of objects in this connection, ignoring pagination.\nThis allows a client to fetch the first five objects by passing "5" as the\nargument to "first", then fetch the total count so it could display "5 of 83",\nfor example.'
            }
          },
          swapiType,
          {
            type: new _graphql.GraphQLList(graphqlType),
            resolve: function resolve(conn) {
              return conn.edges.map(function(edge) {
                return edge.node;
              });
            },
            description:
              'A list of all of the objects returned in the connection. This is a convenience\nfield provided for quickly exploring the API; rather than querying for\n"{ edges { node } }" when no edge data is needed, this field can be be used\ninstead. Note that when clients like Relay need to fetch the "cursor" field on\nthe edge to enable efficient pagination, this shortcut cannot be used, and the\nfull "{ edges { node } }" version should be used instead.'
          }
        );
      }
    }),
    connectionType = _connectionDefinition.connectionType;

  return {
    type: connectionType,
    args: _graphqlRelay.connectionArgs,
    resolve: (function() {
      var _ref2 = (0, _asyncToGenerator3.default)(
        /*#__PURE__*/ _regenerator2.default.mark(function _callee(_, args) {
          var _ref3, objects, totalCount;

          return _regenerator2.default.wrap(
            function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    _context.next = 2;
                    return (0, _apiHelper.getObjectsByType)(swapiType);

                  case 2:
                    _ref3 = _context.sent;
                    objects = _ref3.objects;
                    totalCount = _ref3.totalCount;
                    return _context.abrupt(
                      "return",
                      (0, _extends3.default)(
                        {},
                        (0, _graphqlRelay.connectionFromArray)(objects, args),
                        {
                          totalCount: totalCount
                        }
                      )
                    );

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            },
            _callee,
            _this
          );
        })
      );

      function resolve(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return resolve;
    })()
  };
}

/**
 * The GraphQL type equivalent of the Root resource
 */
var rootType = new _graphql.GraphQLObjectType({
  name: "Root",
  fields: function fields() {
    return {
      allFilms: rootConnection("Films", "films"),
      film: rootFieldByID("filmID", "films"),
      allPeople: rootConnection("People", "people"),
      person: rootFieldByID("personID", "people"),
      allPlanets: rootConnection("Planets", "planets"),
      planet: rootFieldByID("planetID", "planets"),
      allSpecies: rootConnection("Species", "species"),
      species: rootFieldByID("speciesID", "species"),
      allStarships: rootConnection("Starships", "starships"),
      starship: rootFieldByID("starshipID", "starships"),
      allVehicles: rootConnection("Vehicles", "vehicles"),
      vehicle: rootFieldByID("vehicleID", "vehicles"),
      node: _relayNode.nodeField
    };
  }
});

const swSchema = new GraphQLSchema({ query: rootType });

module.exports = swSchema;
