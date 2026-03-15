import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./betterAuth/auth";

// Create a new task with the given text
export const createPost = mutation({
  args: { title: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    } 

    const blogArticle = await ctx.db.insert("posts", {
      title: args.title,
      description: args.description,
      authorId: user._id
    });

    return blogArticle;
  },
});