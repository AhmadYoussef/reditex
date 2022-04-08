import { Post } from "src/entities/Post/Post";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "src/types/myContext.type";
import { PostServices } from "./utils/PostServices";

@Resolver()
export class PostResolver {
  postServices = new PostServices();

  @Query(() => [Post])
  posts(@Ctx() context: MyContext): Promise<Post[]> {
    return this.postServices.posts(context);
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number, @Ctx() context: MyContext): Promise<Post | null> {
    return this.postServices.post(context, id);
  }

  @Mutation(() => Post, { nullable: true })
  async createPost(
    @Arg("title") title: string,
    @Ctx() context: MyContext
  ): Promise<Post | null> {
    return await this.postServices.create(context, title);
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() context: MyContext
  ): Promise<Post | null> {
    return await this.postServices.edit(context, id, title);
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() context: MyContext
  ): Promise<boolean> {
    return await this.postServices.delete(context, id);
  }
}
