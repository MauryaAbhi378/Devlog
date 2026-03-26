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

export const getPaginatedBlogs = query({
  args: {
    page: v.number(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    const total = posts.length;
    const skip = (args.page - 1) * args.limit;
    const paginated = posts.slice(skip, skip + args.limit);

    const items = await Promise.all(
      paginated.map(async (post) => {
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

    return { items, total };
  },
});

export const getFeaturedBlogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 4;
    const posts = await ctx.db.query("posts").collect();
    const comments = await ctx.db.query("comments").collect();

    // Count comments per post
    const commentCountMap = new Map<string, number>();
    for (const comment of comments) {
      const postId = comment.postId;
      commentCountMap.set(postId, (commentCountMap.get(postId) ?? 0) + 1);
    }

    // Sort posts by comment count descending
    const sorted = posts
      .map((post) => ({
        ...post,
        commentCount: commentCountMap.get(post._id) ?? 0,
      }))
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, limit);

    return Promise.all(
      sorted.map(async (post) => {
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
