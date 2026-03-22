import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./betterAuth/auth";
import { query } from "./_generated/server";

export const createPost = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const blogArticle = await ctx.db.insert("posts", {
      title: args.title,
      description: args.description,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
    });

    return blogArticle;
  },
});

export const getBlogs = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();

    return Promise.all(
      posts.map(async (post) => {
        const author = await authComponent.getAnyUserById(ctx, post.authorId);
        return {
          ...post,
          imageUrl: post.imageStorageId
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null,
          authorName: author?.name ?? "Unknown",
        };
      }),
    );
  },
});

export const generateImgaeUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});
