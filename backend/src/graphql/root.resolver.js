import { combineResolvers, skip } from 'graphql-resolvers';
import { AuthenticationError } from 'apollo-server-express';
import graphqlFields from 'graphql-fields';

const exampleEvents = [
  {
    id: 1,
    name: 'Warning 1',
    type: 'warning',
    message: 'Not important but you should fix it',
    createdAt: new Date(),
  },
  {
    id: 2,
    name: 'Warning 2',
    type: 'warning',
    message: 'Not important but you should fix it',
    createdAt: new Date(),
  },
  {
    id: 3,
    name: 'Error 1',
    type: 'error',
    message: 'Please fix it now',
    createdAt: new Date(),
  },
  {
    id: 4,
    name: 'Error 2',
    type: 'error',
    message: 'Please fix it now',
    createdAt: new Date(),
  },
  {
    id: 5,
    name: 'Info 1',
    type: 'info',
    message: 'Thanks for joining',
    createdAt: new Date(),
  },
];

function isAuthenticated(_, __, context) {
  if (context.isAuthenticated) {
    return skip;
  } else {
    throw new AuthenticationError('no authenticated');
  }

}

const resolvers = {
  Query: {
    events: combineResolvers(isAuthenticated, (_, { type }) => {
      return exampleEvents.filter((item) => item.type === type);
    }),
  },
  Mutation: {
    login: (_, { username, password }, __, info) => {
      const fields = graphqlFields(info);
      console.log('Requested fields', fields);
      if (username === 'admin' && password === '123') {
        const data = {
          token: 'some-random-token',
        }
        if (!!fields.user) {
          data.user = {
            id: 9999,
            username: 'David Tran',
            email: 'david@jslancer.com',
            favorites: [
              'javascript',
              'react',
              'swimming',
              'badminton',
              'macbook',
            ],
            isActive: true,
          }
        }
        return data;
      } else {
        throw new AuthenticationError('Incorrect username or password');
      }
    },
  },
};

export default [resolvers];
