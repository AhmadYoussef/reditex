import { MikroORM } from "@mikro-orm/core";
import microConfig from "./configs/mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import getResolvers from "./resolvers";
import { __PROD__ } from "./constants";
import { sessionConfig } from "./configs/session.config";
import { corsConfig } from "./configs/cors.config";
import Redis from "ioredis";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();
  const app = express();

  let redis = new Redis();

  app.use(corsConfig());

  app.use(await sessionConfig(redis));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: getResolvers(),
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em.fork(), req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});
