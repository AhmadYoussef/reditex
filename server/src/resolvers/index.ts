import { NonEmptyArray } from "type-graphql";
import { HelloResolver } from "./hello";
import { PostResolver } from "./post";
import { UserResolver } from "./user";

export default (): NonEmptyArray<Function> => [
  HelloResolver,
  PostResolver,
  UserResolver,
];
