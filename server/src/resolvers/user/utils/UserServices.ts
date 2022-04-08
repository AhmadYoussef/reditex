import { User } from "src/entities/User/User";
import { MyContext } from "src/types/myContext.type";
import { UsernamePasswordInput } from "../types/UsernamePasswordInput.type";
import { validateRegister } from "./validator/validateRegister";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "src/constants";
import { sendEmail } from "src/utlis/sendEmail";
import { v4 } from "uuid";
import { UserResponse } from "../types/UserResponse";

export class UserServices {
  async me({ req, em }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });

    return user;
  }

  async register({ em, req }: MyContext, options: UsernamePasswordInput) {
    const errors = validateRegister(options);

    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
      email: options.email,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.detail.includes("already exists")) {
        const key = err.detail.substring(
          err.detail.indexOf("(") + 1,
          err.detail.indexOf(")")
        );

        return {
          errors: [
            {
              field: key,
              message: key + " is already taken",
            },
          ],
        };
      }
      return {
        errors: [
          {
            field: "",
            message: "something went wrong!",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  async login(
    { em, req }: MyContext,
    usernameOrEmail: string,
    password: string
  ) {
    const user = await em.findOne(
      User,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "That username dosen't exist ",
          },
        ],
      };
    }
    const valid = await argon2.verify((await user).password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;
    return {
      user: user,
    };
  }

  logout({ req, res }: MyContext) {
    return new Promise((reslove) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          reslove(false);
          return;
        }
        reslove(true);
      })
    );
  }

  async forgotPassword({ em, redis }: MyContext, email: string) {
    const user = await em.findOne(User, { email });
    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(FORGET_PASSWORD_PREFIX + token, user.id);
    await redis.set("ex", 1000 * 60 * 60 * 24 * 3);

    sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );
    return true;
  }

  async changePassword(
    { em, redis, req }: MyContext,
    token: string,
    newPassword: string
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }
    const key = FORGET_PASSWORD_PREFIX + token;

    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
    const user = await em.findOne(User, { id: parseInt(userId) });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }
    user.password = await argon2.hash(newPassword);
    await em.persistAndFlush(user);

    await redis.del(key);
    req.session.userId = user.id;

    return { user };
  }
}
