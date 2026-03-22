import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./betterAuth/auth";

export const getCommentsByPostId = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, { postId }) => {
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), postId))
      .order("desc")
      .collect();
    return comments;
  },
});

export const postComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, { postId, content }) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const comment = await ctx.db.insert("comments", {
      postId,
      authorId: user._id,
      authorName: user.name,
      content,
    });

    return comment;
  },
});
