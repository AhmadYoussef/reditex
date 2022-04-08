import connectRedis from "connect-redis";
import { COOKIE_NAME, __PROD__ } from "src/constants";
import session from "express-session";
import { Redis } from "ioredis";

export const sessionConfig = async (redis: Redis) => {
  let RedisStore = connectRedis(session);

  return session({
    name: COOKIE_NAME,
    store: new RedisStore({
      client: redis,
      disableTouch: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
      httpOnly: true,
      sameSite: "lax", // csrf
      secure: __PROD__, // cookie only works in https
    },
    saveUninitialized: false,
    secret: "qowiueojwojfalksdjoqiwueo",
    resave: false,
  });
};
