import Image from "next/image";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ArrowRight } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (minutes < 60) return "JUST NOW";
  if (hours < 24) return `${hours}H AGO`;
  if (days === 1) return "YESTERDAY";
  return `${days} DAYS AGO`;
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:px-8 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <h1 className="font-serif text-5xl font-normal italic leading-[1.05] tracking-tight md:text-6xl lg:text-[5.5rem]">
                Building the
                <br />
                Future of
                <br />
                <span className="underline decoration-[#c4956a] decoration-2 underline-offset-10">
                  Development
                </span>
                .
              </h1>
            </div>
            <div className="flex items-center">
              <div className="border-l-2 border-[#c4956a]/70 pl-6">
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-relaxed">
                  An editorial space for the modern architect. We curate the
                  thoughts, tools, and structures that define the next era of
                  digital craftsmanship.
                </p>
                <div className="mt-6 flex items-center gap-5 text-muted-foreground">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 19.5h4.5L12 8.5l5.5 11H22L12 2zm0 10l-3 6h6l-3-6z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="font-serif text-3xl font-normal italic md:text-4xl">
              Featured Articles
            </h2>
            <Link
              href="/blog"
              className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              View Archive
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Suspense fallback={<FeaturedArticlesSkeleton />}>
            <FeaturedArticles />
          </Suspense>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            {/* Left column */}
            <div className="flex flex-col justify-start">
              <h2 className="font-serif text-4xl font-normal italic leading-tight md:text-5xl">
                Latest
                <br />
                Updates.
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                The pulse of the community. Short-form insights, changelogs, and
                curated links from the web.
              </p>
            </div>

            {/* Right column - blog list */}
            <Suspense fallback={<LatestUpdatesSkeleton />}>
              <LatestUpdates />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-4xl font-normal italic md:text-5xl">
              Join the Newsletter
            </h2>
            <p className="mb-10 text-sm leading-relaxed text-muted-foreground">
              Get a weekly curation of digital architecture, technical essays,
              and high-end developer tools delivered directly to your inbox.
            </p>
            <div className="mx-auto flex max-w-md gap-2">
              <input
                type="email"
                placeholder="john@example.com"
                className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm tracking-wider outline-hidden ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="button"
                className="rounded-lg bg-[#c4956a] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#b8886f]"
              >
                Subscribe
              </button>
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              No spam. Only high-frequency thoughts.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 md:flex-row md:px-6 lg:px-8">
          <Link href="/" className="text-lg font-bold italic">
            Dev<span className="text-[#c4956a]">Logs</span>
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            &copy; 2026 DevLogs. Curating the digital
            architecture.
          </p>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              RSS Feed
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Changelog
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Skeleton loaders ────────────────────────────────────────────────────────

function FeaturedArticlesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-12 md:grid-rows-2">
      <Skeleton className="md:col-span-7 h-85 rounded-xl" />
      <Skeleton className="md:col-span-5 h-85 rounded-xl" />
      <Skeleton className="md:col-span-5 h-64 rounded-xl" />
      <Skeleton className="md:col-span-7 h-64 rounded-xl" />
    </div>
  );
}

function LatestUpdatesSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-border/40">
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          className="flex items-start justify-between gap-6 py-6 first:pt-0 last:pb-0"
        >
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-5 w-3/4 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-11/12 rounded-full" />
          </div>
          <Skeleton className="mt-1 h-3 w-16 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ── Data components ─────────────────────────────────────────────────────────

async function FeaturedArticles() {
  await connection();
  const featuredBlogs = await fetchQuery(api.posts.getFeaturedBlogs, {
    limit: 4,
  });

  if (featuredBlogs.length >= 4) {
    return (
      <div className="grid gap-4 md:grid-cols-12 md:grid-rows-2">
        {/* Top-left - large card with image overlay */}
        <Link
          href={`/blog/${featuredBlogs[0]._id}`}
          className="group relative md:col-span-7 md:row-span-1"
        >
          <div className="relative h-full min-h-85 overflow-hidden rounded-xl bg-card">
            {featuredBlogs[0].imageUrl && (
              <Image
                src={featuredBlogs[0].imageUrl}
                alt={featuredBlogs[0].title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 58vw"
                priority
                unoptimized
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="mb-2 inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4956a]">
                {new Date(featuredBlogs[0]._creationTime).toLocaleDateString(
                  "en-US",
                  { month: "short", year: "numeric" },
                )}
              </span>
              <h3 className="mb-3 font-serif text-2xl font-normal italic leading-tight text-white md:text-3xl">
                {featuredBlogs[0].title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-white/60">
                <span>BY {featuredBlogs[0].authorName.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Top-right - image on top, text below */}
        <Link
          href={`/blog/${featuredBlogs[1]._id}`}
          className="group md:col-span-5 md:row-span-1"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-card">
            <div className="relative aspect-16/10 overflow-hidden">
              {featuredBlogs[1].imageUrl && (
                <Image
                  src={featuredBlogs[1].imageUrl}
                  alt={featuredBlogs[1].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 42vw"
                  unoptimized
                />
              )}
            </div>
            <div className="flex flex-2 flex-col justify-center p-5">
              <div className="flex flex-row gap-2 items-center">
                <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4956a]">
                  {new Date(featuredBlogs[1]._creationTime).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" },
                  )}
                </span>
                <p className="text-xs">
                  BY {featuredBlogs[1].authorName.toUpperCase()}
                </p>
              </div>
              <h3 className="mb-2 font-serif text-lg font-normal italic leading-tight group-hover:text-primary md:text-xl">
                {featuredBlogs[1].title}
              </h3>
              <div
                className="prose prose-sm prose-neutral dark:prose-invert line-clamp-2 text-xs leading-relaxed text-muted-foreground *:m-0"
                dangerouslySetInnerHTML={{ __html: featuredBlogs[1].description }}
              />
            </div>
          </div>
        </Link>

        {/* Bottom-left - text on top, image below */}
        <Link
          href={`/blog/${featuredBlogs[2]._id}`}
          className="group md:col-span-5 md:row-span-1"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-card">
            <div className="flex basis-[55%] flex-col justify-center p-5">
              <div className="flex flex-row gap-2 items-center mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4956a]">
                  {new Date(featuredBlogs[2]._creationTime).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" },
                  )}
                </span>
                <p className="text-xs">
                  BY {featuredBlogs[2].authorName.toUpperCase()}
                </p>
              </div>
              <h3 className="mb-2 font-serif text-lg font-normal italic leading-tight group-hover:text-primary md:text-xl">
                {featuredBlogs[2].title}
              </h3>
              <div
                className="prose prose-sm prose-neutral dark:prose-invert line-clamp-3 text-xs leading-relaxed text-muted-foreground *:m-0"
                dangerouslySetInnerHTML={{ __html: featuredBlogs[2].description }}
              />
            </div>
            <div className="relative basis-[45%] overflow-hidden">
              {featuredBlogs[2].imageUrl && (
                <Image
                  src={featuredBlogs[2].imageUrl}
                  alt={featuredBlogs[2].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 42vw"
                  unoptimized
                />
              )}
            </div>
          </div>
        </Link>

        {/* Bottom-right - image on top, text below */}
        <Link
          href={`/blog/${featuredBlogs[3]._id}`}
          className="group md:col-span-7 md:row-span-1"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-card">
            <div className="relative basis-[45%] overflow-hidden">
              {featuredBlogs[3].imageUrl && (
                <Image
                  src={featuredBlogs[3].imageUrl}
                  alt={featuredBlogs[3].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 58vw"
                  unoptimized
                />
              )}
            </div>
            <div className="flex basis-[55%] flex-col justify-center p-5">
              <div className="flex flex-row gap-2 items-center mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4956a]">
                  {new Date(featuredBlogs[3]._creationTime).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" },
                  )}
                </span>
                <p className="text-xs">
                  BY {featuredBlogs[3].authorName.toUpperCase()}
                </p>
              </div>
              <h3 className="mb-2 font-serif text-lg font-normal italic leading-tight group-hover:text-primary md:text-xl">
                {featuredBlogs[3].title}
              </h3>
              <div
                className="prose prose-sm prose-neutral dark:prose-invert line-clamp-3 text-xs leading-relaxed text-muted-foreground *:m-0"
                dangerouslySetInnerHTML={{ __html: featuredBlogs[3].description }}
              />
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {featuredBlogs.map((blog, index) => (
        <Link key={blog._id} href={`/blog/${blog._id}`} className="group">
          <div className="overflow-hidden rounded-xl border border-border/40 bg-card">
            <div className="relative aspect-video overflow-hidden">
              {blog.imageUrl && (
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index === 0}
                  unoptimized
                />
              )}
            </div>
            <div className="p-5">
              <h3 className="mb-2 font-serif text-lg font-normal italic leading-tight group-hover:text-primary">
                {blog.title}
              </h3>
              <span className="text-xs text-muted-foreground">
                {new Date(blog._creationTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

async function LatestUpdates() {
  await connection();
  const blogs = await fetchQuery(api.posts.getBlogs, {});
  const latestBlogs = blogs.slice(0, 3);

  return (
    <div className="flex flex-col divide-y divide-border/40">
      {latestBlogs.map((blog) => (
        <Link
          key={blog._id}
          href={`/blog/${blog._id}`}
          className="group flex items-start justify-between gap-6 py-6 first:pt-0 last:pb-0"
        >
          <div className="flex-1">
            <span className="mb-1.5 inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4956a]">
              {new Date(blog._creationTime).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
            <h3 className="mb-1.5 text-lg font-semibold leading-tight group-hover:text-primary">
              {blog.title}
            </h3>
            <div
              className="prose prose-sm prose-neutral dark:prose-invert line-clamp-3 text-sm leading-relaxed text-muted-foreground *:m-0"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          </div>
          <span className="shrink-0 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {getRelativeTime(blog._creationTime)}
          </span>
        </Link>
      ))}
    </div>
  );
}
