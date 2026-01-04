import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-600">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            Planeja Chá
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
          >
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  );
}

