import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import CommentSection from "@/components/web/CommentSection";

type BlogDetailPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const {postId} = await params;
  const blogs = await fetchQuery(api.posts.getBlogs, {});
  const blogIndex = blogs.findIndex((blog) => blog._id === postId);
  const blog = blogIndex >= 0 ? blogs[blogIndex] : null; 

  if (!blog) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: `Devlog | ${blog.title}`,
    description: blog.description,
  };

}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { postId } = await params;
  const blogs = await fetchQuery(api.posts.getBlogs, {});
  const blogIndex = blogs.findIndex((blog) => blog._id === postId);
  const blog = blogIndex >= 0 ? blogs[blogIndex] : null;

  if (!blog) {
    notFound();
  }

  return (
    <section className="pb-16 pt-8 md:pb-24 md:pt-12">
      <Card className="overflow-hidden border border-white/10 bg-card/80 py-0 shadow-xl shadow-black/10 backdrop-blur">
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

        <CardHeader className="space-y-4 px-6 py-8 md:px-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              By {blog.authorName}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {new Date(blog._creationTime).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <CardTitle className="max-w-3xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">
            {blog.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-10 md:px-10">
          <div className="max-w-3xl space-y-6 text-base leading-8 text-foreground/90">
            <p>{blog.description}</p>
          </div>

          <div className="mt-10">
            <Button asChild variant="outline">
              <Link href="/blog">Back to all posts</Link>
            </Button>
          </div>

          <CommentSection postId={blog._id} />
        </CardContent>
      </Card>
    </section>
  );
}