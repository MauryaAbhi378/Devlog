import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold">
          Next<span className="text-blue-500">Pro</span>
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
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auth/signup">Sign up</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
        <ModeToggle/>
      </div>
    </nav>
  );
}
