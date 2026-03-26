import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
      <section className="pb-16 pt-8 md:pb-24 md:pt-12">
        <Card className="overflow-hidden border border-white/10 bg-card/80 py-0 shadow-xl shadow-black/10 backdrop-blur">
          {/* Hero image skeleton */}
          <Skeleton className="aspect-21/9 min-h-72 w-full rounded-none" />

          <CardHeader className="space-y-4 px-6 py-8 md:px-10">
            {/* Author & date badges */}
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-7 w-36 rounded-full" />
            </div>
            {/* Title */}
            <div className="max-w-3xl space-y-3">
              <Skeleton className="h-10 w-full md:h-12" />
              <Skeleton className="h-10 w-2/3 md:h-12" />
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-10 md:px-10">
            {/* Blog content skeleton */}
            <div className="max-w-3xl space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Back button skeleton */}
            <div className="mt-10">
              <Skeleton className="h-10 w-36" />
            </div>

            {/* Comment section skeleton */}
            <div className="mt-10 space-y-6">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-24 w-full" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2 rounded-lg border border-white/10 p-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
