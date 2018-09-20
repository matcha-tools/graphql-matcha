'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _relayNode = require('../relayNode');

var _commonFields = require('../commonFields');

var _connections = require('../connections');

var _apiHelper = require('../apiHelper');

var _film = require('./film');

var _film2 = _interopRequireDefault(_film);

var _person = require('./person');

var _person2 = _interopRequireDefault(_person);

var _planet = require('./planet');

var _planet2 = _interopRequireDefault(_planet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The GraphQL type equivalent of the Species resource
 */
var SpeciesType = new _graphql.GraphQLObjectType({
  name: 'Species',
  description: 'A type of person or character within the Star Wars Universe.',
  fields: function fields() {
    return {
      name: {
        type: _graphql.GraphQLString,
        description: 'The name of this species.'
      },
      classification: {
        type: _graphql.GraphQLString,
        description: 'The classification of this species, such as "mammal" or "reptile".'
      },
      designation: {
        type: _graphql.GraphQLString,
        description: 'The designation of this species, such as "sentient".'
      },
      averageHeight: {
        type: _graphql.GraphQLFloat,
        resolve: function resolve(species) {
          return (0, _apiHelper.convertToNumber)(species.average_height);
        },
        description: 'The average height of this species in centimeters.'
      },
      averageLifespan: {
        type: _graphql.GraphQLInt,
        resolve: function resolve(species) {
          return (0, _apiHelper.convertToNumber)(species.average_lifespan);
        },
        description: 'The average lifespan of this species in years, null if unknown.'
      },
      eyeColors: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString),
        resolve: function resolve(species) {
          return species.eye_colors.split(',').map(function (s) {
            return s.trim();
          });
        },
        description: 'Common eye colors for this species, null if this species does not typically\nhave eyes.'
      },
      hairColors: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString),
        resolve: function resolve(species) {
          if (species.hair_colors === 'none') {
            return [];
          }
          return species.hair_colors.split(',').map(function (s) {
            return s.trim();
          });
        },
        description: 'Common hair colors for this species, null if this species does not typically\nhave hair.'
      },
      skinColors: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString),
        resolve: function resolve(species) {
          return species.skin_colors.split(',').map(function (s) {
            return s.trim();
          });
        },
        description: 'Common skin colors for this species, null if this species does not typically\nhave skin.'
      },
      language: {
        type: _graphql.GraphQLString,
        description: 'The language commonly spoken by this species.'
      },
      homeworld: {
        type: _planet2.default,
        resolve: function resolve(species) {
          return species.homeworld ? (0, _apiHelper.getObjectFromUrl)(species.homeworld) : null;
        },
        description: 'A planet that this species originates from.'
      },
      personConnection: (0, _connections.connectionFromUrls)('SpeciesPeople', 'people', _person2.default),
      filmConnection: (0, _connections.connectionFromUrls)('SpeciesFilms', 'films', _film2.default),
      created: (0, _commonFields.createdField)(),
      edited: (0, _commonFields.editedField)(),
      id: (0, _graphqlRelay.globalIdField)('species')
    };
  },
  interfaces: function interfaces() {
    return [_relayNode.nodeInterface];
  }
}); /**
     * Copyright (c) 2015-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the license found in the
     * LICENSE-examples file in the root directory of this source tree.
     *
     *  strict
     */

exports.default = SpeciesType;