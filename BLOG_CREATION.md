# Blog Creation & Image Handling

An end-to-end walkthrough of how a blog post is created and how cover images are uploaded, stored, and rendered in this platform.

---

## Stack at a Glance

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) |
| Backend / DB | Convex |
| Auth | Better Auth (via `convex-dev/better-auth`) |
| Forms | React Hook Form + Zod |
| Image storage | Convex `_storage` (built-in file storage) |

---

## 1. Data Schema

Posts are stored in a Convex table defined in `convex/schema.ts`. Each post holds a reference to a file in Convex's built-in `_storage` instead of a raw URL, which keeps images inside the same platform.

```ts
// convex/schema.ts
export default defineSchema({
  posts: defineTable({
    title: v.string(),
    description: v.string(),
    authorId: v.string(),
    imageStorageId: v.id("_storage"), // pointer into Convex file storage
  }),
});
```

---

## 2. Form Validation Schema

`app/schemas/blog.ts` defines the Zod schema that validates user input on both the client and the server action.

```ts
// app/schemas/blog.ts
import z from "zod"

export const createBlogSchema = z.object({
  title:   z.string().min(5).max(100),
  content: z.string().min(20),
  image:   z.instanceof(File),   // must be a real File object
})
```

---

## 3. The Create Page (Client Component)

`app/(shared-layout)/create/page.tsx` handles:

- Local image preview via `URL.createObjectURL`
- Form state via React Hook Form
- Delegating the actual submission to a Server Action

### 3a. Image Preview

When the user picks a file the component generates a temporary object URL for an instant preview, and cleans it up on unmount or when a new file is chosen.

```tsx
// app/(shared-layout)/create/page.tsx
const [imageFile, setImageFile] = useState<File | null>(null)
const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

// Revoke old blob URL to avoid memory leaks
useEffect(() => {
  return () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
  }
}, [imagePreviewUrl])

function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0] ?? null

  if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)

  setImageFile(file)
  if (file) {
    setImagePreviewUrl(URL.createObjectURL(file))
    setValue("image", file, { shouldDirty: true, shouldValidate: true })
    return
  }

  setImagePreviewUrl(null)
  setValue("image", undefined as never, { shouldDirty: true, shouldValidate: true })
}
```

### 3b. Preview Rendering

The preview is rendered inside a fixed-ratio container using Next.js `<Image>` with `fill` and `unoptimized` (because the blob URL is local and cannot be processed by Next's image CDN).

```tsx
{imagePreviewUrl && (
  <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/30">
    <div className="relative aspect-16/10 w-full">
      <Image
        src={imagePreviewUrl}
        alt="Selected cover preview"
        fill
        className="object-cover"
        unoptimized   // blob URLs skip Next.js image optimisation
      />
    </div>
  </div>
)}
```

### 3c. Form Submission

On submit the validated data is passed straight to `createPostAction` (a Server Action). The form is reset and the user is redirected to the new post.

```tsx
async function onSubmit(data: CreateBlogData) {
  try {
    const postId = await createPostAction(data)

    toast.success("Post created!", { description: "Your blog article has been published." })

    reset()
    setImageFile(null)
    URL.revokeObjectURL(imagePreviewUrl!)
    setImagePreviewUrl(null)
    setImageInputKey((k) => k + 1)   // resets the <input type="file"> element
    router.push(`/blog/${postId}`)
  } catch (error) {
    const description = error instanceof Error ? error.message : "Failed to create the post."
    toast.error("Something went wrong", { description })
  }
}
```

---

## 4. Server Action — `createPostAction`

`app/actions.ts` is a Next.js Server Action marked `"use server"`. It orchestrates the two-step upload-then-insert flow required by Convex storage.

```ts
// app/actions.ts
"use server";

export async function createPostAction(
  input: z.infer<typeof createBlogSchema>,
): Promise<Id<"posts">> {
  // 1. Validate input on the server
  const parsedInput = createBlogSchema.safeParse(input)
  if (!parsedInput.success) throw new Error("Invalid post data.")

  // 2. Ask Convex for a one-time upload URL (authenticated)
  const uploadUrl = await fetchAuthMutation(api.posts.generateImgaeUploadUrl, {})

  // 3. PUT the raw file bytes directly to Convex storage
  const uploadResult = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": parsedInput.data.image.type },
    body: parsedInput.data.image,
  })

  if (!uploadResult.ok) throw new Error("Failed to upload image.")

  // 4. Convex returns a storageId for the saved file
  const { storageId } = await uploadResult.json()

  // 5. Insert the post document referencing the storageId
  const postId = await fetchAuthMutation(api.posts.createPost, {
    title:          parsedInput.data.title,
    description:    parsedInput.data.content,
    imageStorageId: storageId,
  })

  return postId
}
```

---

## 5. Convex Mutations

Both mutations live in `convex/posts.ts` and run inside the Convex backend.

### 5a. Generate Upload URL

Only authenticated users can generate an upload URL, which Convex returns as a short-lived signed URL pointing to its own object storage.

```ts
// convex/posts.ts
export const generateImgaeUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx)
    if (!user) throw new ConvexError("Not authenticated")

    return await ctx.storage.generateUploadUrl()
  },
})
```

### 5b. Create Post

After the image is uploaded the mutation inserts the post document. It stores the `imageStorageId` (not a URL), so the actual file URL is resolved dynamically at read time.

```ts
// convex/posts.ts
export const createPost = mutation({
  args: {
    title:          v.string(),
    description:    v.string(),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx)
    if (!user) throw new ConvexError("Not authenticated")

    return await ctx.db.insert("posts", {
      title:          args.title,
      description:    args.description,
      authorId:       user._id,
      imageStorageId: args.imageStorageId,
    })
  },
})
```

---

## 6. Reading Posts — Resolving Image URLs

The `getBlogs` query calls `ctx.storage.getUrl()` to convert each stored `imageStorageId` into a temporary public URL before returning the data to the client.

```ts
// convex/posts.ts
export const getBlogs = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect()

    return Promise.all(
      posts.map(async (post) => ({
        ...post,
        imageUrl: post.imageStorageId
          ? await ctx.storage.getUrl(post.imageStorageId)
          : null,
      })),
    )
  },
})
```

---

## 7. Displaying Posts

### Blog List (`app/(shared-layout)/blog/page.tsx`)

The listing uses React `<Suspense>` to show skeleton loaders while the async `ListBlog` component fetches data from Convex on the server.

```tsx
// Blog card with cover image
<div className="relative aspect-16/10 overflow-hidden">
  <Image
    src={blog.imageUrl ?? "https://source.unsplash.com/random/?coding"}
    alt={blog.title}
    fill
    className="object-cover transition-transform duration-500 hover:scale-105"
    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
    priority={index < 3}
    unoptimized={Boolean(blog.imageUrl)}  // Convex URLs bypass Next optimisation
  />
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
</div>
```

### Blog Detail (`app/(shared-layout)/blog/[postId]/page.tsx`)

The detail page fetches all posts, finds the requested one by ID, and renders the hero image at a wider `aspect-21/9` ratio.

```tsx
export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { postId } = await params
  const blogs = await fetchQuery(api.posts.getBlogs, {})
  const blog  = blogs.find((b) => b._id === postId) ?? null

  if (!blog) notFound()

  return (
    <div className="relative aspect-21/9 min-h-72 w-full overflow-hidden">
      <Image
        src={blog.imageUrl ?? "https://source.unsplash.com/random/?coding"}
        alt={blog.title}
        fill
        className="object-cover"
        sizes="100vw"
        priority
        unoptimized={Boolean(blog.imageUrl)}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
    </div>
  )
}
```

---

## 8. Full Data Flow Diagram

```
User selects image
       │
       ▼
handleImageChange()
  URL.createObjectURL()  ──► <Image src={blobUrl} unoptimized />  (preview)
       │
       ▼
onSubmit() → createPostAction()  [Server Action]
       │
       ├─ 1. generateImgaeUploadUrl mutation  → signed upload URL
       │
       ├─ 2. fetch(uploadUrl, { method: "POST", body: file })
       │         └─► file saved in Convex _storage
       │                    └─► storageId returned
       │
       └─ 3. createPost mutation(title, description, storageId)
                  └─► posts table row inserted
                            └─► postId returned → router.push(/blog/:postId)


Read path:
getBlogs query
  └─ ctx.storage.getUrl(imageStorageId)  → temporary public URL
       └─► <Image src={imageUrl} unoptimized />  (blog list / detail)
```

---

## Key Design Decisions

| Decision | Reason |
|---|---|
| Store `imageStorageId`, not a URL | URLs can expire; the storage ID is permanent and the URL is resolved fresh each query |
| `unoptimized` on Convex image URLs | Convex signed URLs contain special characters that confuse Next.js image optimisation |
| `URL.revokeObjectURL` on cleanup | Prevents memory leaks from lingering blob object URLs |
| Two-step upload (URL → file → insert) | Convex's storage API requires generating a signed upload URL before streaming the file |
| Server Action validates again with Zod | Client-side validation can be bypassed; the server always re-parses before writing |
