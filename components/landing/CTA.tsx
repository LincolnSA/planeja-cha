"use client";

import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";

export function CTA() {
  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <section className="w-full bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 sm:px-4">
            <Sparkles className="h-4 w-4 text-orange-600 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-orange-700">
              Comece gratuitamente
            </span>
          </div>

          {/* Headline */}
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl px-2">
            Pronto para criar um{" "}
            <span className="font-[family-name:var(--font-serif)] italic text-orange-600">
              momento mágico?
            </span>
          </h2>

          {/* Description */}
          <p className="mb-8 text-base text-muted-foreground sm:text-lg md:text-xl px-4">
            Junte-se a milhares de famílias que já organizaram seus chás de
            bebê com a gente. Crie seu chá em minutos!
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center gap-4">
            <Button
              onClick={handleSignIn}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-6 text-sm sm:px-8 sm:text-base cursor-pointer w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Entrar com Google para criar meu planejamento</span>
              <span className="sm:hidden">Entrar com Google</span>
              <Heart className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Sem cartão de crédito necessário
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

