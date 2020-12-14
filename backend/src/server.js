import express from 'express';
import Apollo from 'apollo-server-express';
import { AuthenticationError } from 'apollo-server-express';
import cors from 'cors';
import rootSchema from './graphql/root.schema.js';
import rootResolver from './graphql/root.resolver.js';

const app = express();
const port = process.env.PORT || 5000;
const corsOptions = {
  optionsSuccessStatus: 200,
  credentials: true,
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));

(function startServer() {
  const serverGraph = new Apollo.ApolloServer({
    schema: Apollo.makeExecutableSchema({
      typeDefs: rootSchema,
      resolvers: rootResolver,
    }),
    context: async ({ req }) => {
      const bearerToken = req.headers.authorization;
      console.log(bearerToken);
      if (!bearerToken) {
        return null;
      } else if (bearerToken === 'Bearer some-random-token') {
        return {
          isAuthenticated: true,
        };
      } else {
        throw new AuthenticationError('Authentication failed');
      }
    },
  });

  serverGraph.applyMiddleware({ app, cors: corsOptions });
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
})();
