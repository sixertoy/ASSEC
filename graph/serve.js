// https://dev-blog.apollodata.com/tutorial-building-a-graphql-server-cddaa023c035
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { makeExecutableSchema } from 'graphql-tools';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import { logger } from './app/utils/logger';
import { usedebug } from './app/utils/usedebug';

import schemas from './app/schemas';
import * as resolvers from './app/resolvers';

const graphqlport = process.env.PORT;

// application
const schema = makeExecutableSchema({ typeDefs: schemas, resolvers });

const app = express();
app.use(cors());
app.use(
  '/graphql',
  // bodyParser is needed just for POST.
  bodyParser.json(),
  graphqlExpress({
    schema,
    // Apollo Server accepts a GraphQLOptions object as its single argument
    // @see apollographql.com/docs/apollo-server/setup.html#graphqlOptions
    debug: usedebug(),
  }),
);

if (usedebug()) {
  // use GraphQL web interface only in development environment
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

// Do graceful shutdown
process.on('SIGINT', () => {
  logger.ok('graceful shutdown express');
  app.close(() => {
    // FIXME -> cleanup DB connections
    logger.debug('closed express');
  });
});

app.listen(graphqlport, () => {
  logger.ok(`GraphQL served under http://localhost:${graphqlport}/graphql`);
  if (!usedebug()) return;
  logger.ok(`GraphiQL is now running under http://localhost:${graphqlport}/graphiql`);
});
