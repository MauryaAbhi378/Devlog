import z from "zod"

// Helper function to strip HTML tags and get text length
const getTextLength = (html: string): number => {
  const text = html.replace(/<[^>]*>/g, '').trim();
  return text.length;
};

export const createBlogSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
    content: z.string()
      .min(1, "Content is required")
      .refine(
        (html) => getTextLength(html) >= 20,
        "Content must be at least 20 characters (excluding HTML tags)"
      ),
    image : z.instanceof(File, { message: "Cover image is required" })
})