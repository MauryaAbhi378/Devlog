import Image from "next/image";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Suspense } from "react";
import { Metadata } from "next";
import { connection } from "next/server";

const POSTS_PER_PAGE = 6;

export const metadata: Metadata = {
  title: 'Devlog | Blogs',
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
      <section className="pb-16 pt-8 md:pb-24 md:pt-12">
        <Suspense fallback={<BlogListLoader />}>
          <ListBlog searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}

function BlogListLoader() {
  return (
    <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
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

          <CardFooter className="border-0 bg-transparent p-5 pt-0">
            <Skeleton className="h-10 w-full rounded-xl" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

async function ListBlog({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await connection();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const { items: blogs, total } = await fetchQuery(
    api.posts.getPaginatedBlogs,
    { page, limit: POSTS_PER_PAGE },
  );

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  // Build the page numbers to display (with ellipsis for large ranges)
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [1];
    if (page > 3) pages.push("ellipsis");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  };

  return (
    <>
      <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 xl:grid-cols-3">
        {blogs.map((blog, index) => (
          <Card
            key={blog._id}
            className="overflow-hidden border border-white/10 bg-card/80 py-0 shadow-xl shadow-black/10 backdrop-blur"
          >
            <div className="relative aspect-16/10 overflow-hidden">
              <Image
                src={
                  blog.imageUrl ?? "https://source.unsplash.com/random/?coding"
                }
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                priority={index < 3}
                unoptimized={Boolean(blog.imageUrl)}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
            </div>

            <CardHeader className="flex-1 space-y-3 px-5 pt-5">
              <CardTitle className="line-clamp-1 font-serif text-2xl font-semibold tracking-tight">
                {blog.title}
              </CardTitle>
              <div
                className="prose prose-sm prose-neutral dark:prose-invert line-clamp-3 max-h-20 overflow-hidden text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            </CardHeader>

            <CardFooter className="border-t-0 bg-transparent p-5 pt-0">
              <Button asChild className="w-full rounded-xl">
                <Link href={`/blog/${blog._id}`}>Read more</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={`?page=${page - 1}`} />
                </PaginationItem>
              )}

              {getPageNumbers().map((pageNum, i) =>
                pageNum === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={`?page=${pageNum}`}
                      isActive={pageNum === page}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href={`?page=${page + 1}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
