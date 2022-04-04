import { MikroORM, Options } from "@mikro-orm/core";
import { __PROD__ } from "./constants";
import path from "path";
import entities from "./entities";

const config: Options = {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.ts$/,
  },
  entities: entities,
  dbName: "lireddit",
  type: "postgresql",
  user: "ahmyou",
  debug: !__PROD__,
};

export default config;

// export default {
//   migrations: {
//     path: path.join(__dirname, "./migrations"),
//     pattern: /^[\w-]+\d+\.[tj]s$/,
//   },
//   entities: [Post],
//   dbName: "lireddit",
//   type: "postgresql",
//   user: "ahmyou",
//   debug: !__PROD__,
// } as Parameters<typeof MikroORM.init>[0];
