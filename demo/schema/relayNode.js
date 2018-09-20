'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeField = exports.nodeInterface = undefined;
exports.swapiTypeToGraphQLType = swapiTypeToGraphQLType;

var _apiHelper = require('./apiHelper');

var _graphqlRelay = require('graphql-relay');

/**
 * Given a "type" in SWAPI, returns the corresponding GraphQL type.
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

function swapiTypeToGraphQLType(swapiType) {
  var FilmType = require('./types/film').default;
  var PersonType = require('./types/person').default;
  var PlanetType = require('./types/planet').default;
  var SpeciesType = require('./types/species').default;
  var StarshipType = require('./types/starship').default;
  var VehicleType = require('./types/vehicle').default;

  switch (swapiType) {
    case 'films':
      return FilmType;
    case 'people':
      return PersonType;
    case 'planets':
      return PlanetType;
    case 'starships':
      return StarshipType;
    case 'vehicles':
      return VehicleType;
    case 'species':
      return SpeciesType;
    default:
      throw new Error('Unrecognized type `' + swapiType + '`.');
  }
}

var _nodeDefinitions = (0, _graphqlRelay.nodeDefinitions)(function (globalId) {
  var _fromGlobalId = (0, _graphqlRelay.fromGlobalId)(globalId),
      type = _fromGlobalId.type,
      id = _fromGlobalId.id;

  return (0, _apiHelper.getObjectFromTypeAndId)(type, id);
}, function (obj) {
  var parts = obj.url.split('/');
  return swapiTypeToGraphQLType(parts[parts.length - 3]);
}),
    nodeInterface = _nodeDefinitions.nodeInterface,
    nodeField = _nodeDefinitions.nodeField;

exports.nodeInterface = nodeInterface;
exports.nodeField = nodeField;