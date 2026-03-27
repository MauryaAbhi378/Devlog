"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = (formData.get("search") as string).trim();
    startTransition(() => {
      if (search) {
        router.push(`/blog?search=${encodeURIComponent(search)}`);
      } else {
        router.push("/blog");
      }
    });
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = "";
    startTransition(() => {
      router.push("/blog");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          name="search"
          placeholder="Search blogs..."
          defaultValue={currentSearch}
          className="h-10 pl-9 pr-9"
        />
        {currentSearch && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="submit" disabled={isPending} className="h-10">
        {isPending ? "Searching…" : "Search"}
      </Button>
    </form>
  );
}
