import { NonEmptyArray } from "type-graphql";
import { HelloResolver } from "./hello/hello";
import { PostResolver } from "./post/post";
import { UserResolver } from "./user/user";

export default (): NonEmptyArray<Function> => [
  HelloResolver,
  PostResolver,
  UserResolver,
];
