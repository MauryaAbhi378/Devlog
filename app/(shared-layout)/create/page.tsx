"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { createBlogSchema } from "@/app/schemas/blog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

type CreateBlogData = z.infer<typeof createBlogSchema>

export default function CreatePage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBlogData>({
    resolver: zodResolver(createBlogSchema),
  })
  const mutation = useMutation(api.posts.createPost)
  const router = useRouter()

  async function onSubmit(data: CreateBlogData) {
    try {
      await mutation({
        title: data.title,
        description: data.content,
      })
      toast.success("Post created!", {
        description: "Your blog article has been published.",
      })
      reset()
      router.push("/")
    } catch {
      toast.error("Something went wrong", {
        description: "Failed to create the post. Please try again.",
      })
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-start px-4 pt-20">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Create Post</h1>
        <p className="mt-3 text-muted-foreground">
          Share your thoughts with the big world
        </p>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Create Blog Article</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="super cool title"
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Super cool blog content"
                className="min-h-40 resize-none"
                aria-invalid={!!errors.content}
                {...register("content")}
              />
              {errors.content && (
                <p className="text-xs text-destructive">
                  {errors.content.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Post"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
