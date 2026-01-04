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
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-600">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            Planeja Chá
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Button
            onClick={handleSignIn}
            variant="outline"
            size="sm"
            className="border-green-600 text-green-600 hover:bg-green-50 px-4 py-3 text-base cursor-pointer"
          >
            Entrar com Google
          </Button>
        </nav>
      </div>
    </header>
  );
}

