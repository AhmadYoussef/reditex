import { __PROD__ } from "src/constants";
import path from "path";
import entities from "src/entities";
import { MikroORM } from "@mikro-orm/core";

export default {
  migrations: {
    path: path.join(__dirname, "../migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: entities,
  dbName: "lireddit",
  type: "postgresql",
  user: "ahmyou",
  debug: !__PROD__,
} as Parameters<typeof MikroORM.init>[0];
