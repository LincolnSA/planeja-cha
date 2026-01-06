"use client";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export function Header() {
  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-600 shrink-0">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-semibold text-foreground">
            Planeja Chá
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button
            onClick={handleSignIn}
            variant="outline"
            size="sm"
            className="border-orange-600 text-orange-600 hover:bg-orange-50 px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm cursor-pointer whitespace-nowrap"
          >
            <span className="hidden sm:inline">Entrar com Google</span>
            <span className="sm:hidden">Entrar</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}

