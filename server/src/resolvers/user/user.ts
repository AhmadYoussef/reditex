import { User } from "src/entities/User/User";
import { MyContext } from "src/types/myContext.type";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserResponse } from "./types/UserResponse";
import { UsernamePasswordInput } from "./types/UsernamePasswordInput.type";
import { UserServices } from "./utils/UserServices";

@Resolver()
export class UserResolver {
  userServices = new UserServices();

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() context: MyContext
  ) {
    return await this.userServices.changePassword(context, token, newPassword);
  }

  @Mutation(() => Boolean)
  forgotPassword(@Arg("email") email: string, @Ctx() context: MyContext) {
    return this.userServices.forgotPassword(context, email);
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() context: MyContext) {
    return await this.userServices.me(context);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    return await this.userServices.register(context, options);
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    return await this.userServices.login(context, usernameOrEmail, password);
  }

  @Mutation(() => Boolean)
  logout(@Ctx() context: MyContext) {
    return this.userServices.logout(context);
  }
}
