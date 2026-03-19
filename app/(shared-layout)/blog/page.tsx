import Image from "next/image";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getBlogImage } from "@/lib/blog-images";
import { Suspense } from "react";

export default function BlogPage() {
  return (
    <section className="pb-16 pt-8 md:pb-24 md:pt-12">
      <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0))] px-6 py-14 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] md:px-10">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Editorial Picks
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance md:text-6xl">
            Our Blog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Insights, thoughts, and practical notes from the team behind the
            platform.
          </p>
        </div>
      </div>

      <Suspense fallback={<BlogListLoader />}>
        <ListBlog />
      </Suspense>

      {/* {blogs.length === 0 ? (
				<Card className="mt-10 border-dashed bg-transparent py-8 text-center">
					<CardHeader>
						<CardTitle>No blog posts yet</CardTitle>
						<CardDescription>
							Create your first post.
						</CardDescription>
					</CardHeader>
				</Card>
			) : null} */}
    </section>
  );
}

function BlogListLoader() {
  return (
    <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <Card
          key={index}
          className="overflow-hidden border border-white/10 bg-card/80 py-0 shadow-xl shadow-black/10 backdrop-blur"
        >
          <Skeleton className="aspect-16/10 rounded-none" />

          <CardHeader className="space-y-3 px-5 pt-5">
            <Skeleton className="h-7 w-3/4 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-11/12 rounded-full" />
              <Skeleton className="h-4 w-2/3 rounded-full" />
            </div>
          </CardHeader>

          <CardFooter className="border-t border-white/10 bg-transparent p-5 pt-0">
            <Skeleton className="h-10 w-full rounded-xl" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

async function ListBlog() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const blogs = await fetchQuery(api.posts.getBlogs, {});

  return (
    <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 xl:grid-cols-3">
      {blogs.map((blog, index) => (
        <Card
          key={blog._id}
          className="overflow-hidden border border-white/10 bg-card/80 py-0 shadow-xl shadow-black/10 backdrop-blur"
        >
          <div className="relative aspect-16/10 overflow-hidden">
            <Image
              src={getBlogImage(index)}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              priority={index < 3}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
          </div>

          <CardHeader className="space-y-3 px-5 pt-5">
            <CardTitle className="text-2xl font-semibold tracking-tight text-pretty">
              {blog.title}
            </CardTitle>
            <CardDescription className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {blog.description}
            </CardDescription>
          </CardHeader>

          <CardFooter className="border-t border-white/10 bg-transparent p-5 pt-0">
            <Button asChild className="w-full rounded-xl">
              <Link href={`/blog/${blog._id}`}>Read more</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
