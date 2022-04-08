import { Post } from "src/entities/Post/Post";
import { MyContext } from "src/types/myContext.type";

export class PostServices {
  posts({ em }: MyContext) {
    return em.fork().find(Post, {});
  }

  post({ em }: MyContext, id: number) {
    return em.findOne(Post, { id });
  }

  async create({ em }: MyContext, title: string) {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  async edit({ em }: MyContext, id: number, title: string) {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  async delete({ em }: MyContext, id: number) {
    await em.nativeDelete(Post, { id });
    return true;
  }
}
