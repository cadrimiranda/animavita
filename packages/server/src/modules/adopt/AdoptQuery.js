import {
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';
import {
  FILTER_CONDITION_TYPE,
  buildMongoConditionsFromFilters
} from '@entria/graphql-mongo-helpers';
import mongoose from 'mongoose';
import AdoptType from './AdoptType';
import AdoptModel from './AdoptModel';

const { ObjectId } = mongoose.Types;

const mapping = {
  size: {
    type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: (size) => {
      if (size !== '') {
        return { size };
      }
      return null;
    }
  },
  gender: {
    type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: (gender) => {
      if (gender !== '') {
        return { gender };
      }
      return null;
    }
  },
  type: {
    type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: (type) => {
      if (type !== '') {
        return { type };
      }

      return null;
    }
  },
  age: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1
  },
  distance: {
    type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: () => null
  }
};

export default {
  adopts: {
    type: GraphQLList(AdoptType),
    description: 'Take all adoptions near authenticated user',
    args: {
      filter: {
        type: new GraphQLInputObjectType({
          name: 'AdoptsFilter',
          fields: () => ({
            size: {
              type: GraphQLString
            },
            gender: {
              type: GraphQLString
            },
            type: {
              type: GraphQLString
            },
            age_gte: {
              type: GraphQLInt
            },
            distance: {
              type: GraphQLInt
            }
          })
        })
      },
      first: {
        name: 'first',
        type: GraphQLInt
      },
      skip: {
        name: 'skip',
        type: GraphQLInt
      }
    },
    resolve: async (_, { filter, first = null, skip = null }, context) => {
      const { user } = context;
      const { distance } = filter;
      const filterResult = buildMongoConditionsFromFilters(context, filter, mapping);
      const conditions = {
        ...filterResult.conditions,
        user: {
          $ne: ObjectId(context.user._id)
        },
        location: {
          $near: {
            $maxDistance: distance * 1000,
            $geometry: {
              type: 'Point',
              coordinates: user.location.coordinates
            }
          }
        },
        adopted: false
      };

      return AdoptModel.find(conditions)
        .skip(skip)
        .limit(first);
    }
  },
  adopt: {
    type: AdoptType,
    description: 'Take specific adopt by id',
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    resolve: (_, { id }) => AdoptModel.findById(id)
  }
};
