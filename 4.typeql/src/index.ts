import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { createConnection } from 'typeorm';
import connectRedis from 'connect-redis';
import session from 'express-session';
import cors from 'cors';
import { redis } from './redis';
import { createSchema } from './utils/createSchema';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'type-graphql/node_modules/graphql-query-complexity';

const main = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    plugins: [
      {
        requestDidStart: () =>
          ({
            didResolveOperation({ request, document }: any) {
              const complexity = getComplexity({
                schema,
                operationName: request.operationName,
                query: document,
                variables: request.variables,
                estimators: [
                  fieldExtensionsEstimator(),
                  simpleEstimator({ defaultComplexity: 1 }),
                ],
              });
              if (complexity > 8) {
                throw new Error(
                  `Sorry, too complicated query! ${complexity} is over 8 that is the max allowed complexity.`
                );
              }
              console.log('Used query complexity points:', complexity);
            },
          } as any),
      },
    ],
  });

  const app = Express();

  const whitelist = [
    'http://localhost:3000/', //frontend
    'https://studio.apollographql.com',
  ];
  app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin as string) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    })
  );

  const RedisStore = connectRedis(session);
  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: 'qid',
      secret: 'aslkdfjoiq12312', //TODO: this should be in environment
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/' });

  app.listen(4000, () => {
    console.log('Server started on http://localhost:4000/');
  });
};

main();
