"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createBlogSchema } from "@/app/schemas/blog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createPostAction } from "@/app/actions";
import RichTextEditor from "@/components/web/RichTextEditor";

type CreateBlogData = z.infer<typeof createBlogSchema>;

export default function CreatePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateBlogData>({
    resolver: zodResolver(createBlogSchema),
    mode: "onSubmit", // Validate on submit
  });
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  async function onSubmit(data: CreateBlogData) {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("image", data.image);
      const postId = await createPostAction(formData);

      toast.success("Post created!", {
        description: "Your blog article has been published.",
      });

      reset();
      setImageFile(null);
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(null);
      setImageInputKey((currentKey) => currentKey + 1);
      router.push(`/blog/${postId}`);
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Failed to create the post.";

      toast.error("Something went wrong", {
        description,
      });
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setImageFile(file);
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
      setValue("image", file, { shouldDirty: true, shouldValidate: true });
      return;
    }

    setImagePreviewUrl(null);
    setValue("image", undefined as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-start px-4 pt-20">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Create Blog Article
        </h1>
        <p className="mt-3 text-muted-foreground">
          Share your thoughts with the big world
        </p>
      </div>

      <Card className="w-full max-w-2xl">
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="super cool title"
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                value={watch("content") ?? ""}
                onChange={(html) => {
                  setValue("content", html, {
                    shouldDirty: true,
                    shouldValidate: false, // Disable validation on every change
                  });
                }}
                placeholder="Write your blog content here…"
              />
              {errors.content && (
                <p className="text-xs text-destructive">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="coverImage">Cover Image</Label>
              <Input
                key={imageInputKey}
                id="coverImage"
                type="file"
                accept="image/*"
                aria-invalid={!!errors.image}
                onChange={handleImageChange}
              />
              <input type="hidden" {...register("image")} />
              <p className="text-xs text-muted-foreground">
                Select a cover image for your post.
              </p>
              {imagePreviewUrl && (
                <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/30">
                  <div className="relative aspect-16/10 w-full">
                    <Image
                      src={imagePreviewUrl}
                      alt="Selected cover preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}
              {errors.image && (
                <p className="text-xs text-destructive">
                  {errors.image.message}
                </p>
              )}
              {imageFile && (
                <div className="rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  Selected:{" "}
                  <span className="font-medium text-foreground">
                    {imageFile.name}
                  </span>
                </div>
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
  );
}
