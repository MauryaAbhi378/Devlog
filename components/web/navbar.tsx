"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold">
          Dev<span className="text-blue-500">Logs</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/create" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Create
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isLoading && (
          isAuthenticated && session?.user ? (
            <>
              <span className="text-sm font-medium">{session.user.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
            </>
          )
        )}
        <ModeToggle />
      </div>
    </nav>
  );
}
