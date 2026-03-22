"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createBlogSchema } from "@/app/schemas/blog";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { fetchAuthMutation } from "@/lib/auth-server";

export async function createPostAction(
  input: z.infer<typeof createBlogSchema>,
): Promise<Id<"posts">> {
  const parsedInput = createBlogSchema.safeParse(input);

  if (!parsedInput.success) {
    throw new Error("Invalid post data.");
  }

  try {
    const imageUrl = await fetchAuthMutation(
      api.posts.generateImgaeUploadUrl,
      {},
    );

    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: { "Content-Type": parsedInput.data.image.type },
      body: parsedInput.data.image,
    });

    if (!uploadResult.ok) {
      throw new Error("Failed to upload image.");
    }

    const { storageId } = await uploadResult.json();

    const postId = await fetchAuthMutation(api.posts.createPost, {
      title: parsedInput.data.title,
      description: parsedInput.data.content,
      imageStorageId: storageId,
    });

    return postId;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create post.");
  }
}
