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
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Comece gratuitamente
            </span>
          </div>

          {/* Headline */}
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Pronto para criar um{" "}
            <span className="font-[family-name:var(--font-serif)] italic text-green-600">
              momento mágico?
            </span>
          </h2>

          {/* Description */}
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            Junte-se a milhares de famílias que já organizaram seus chás de
            bebê com a gente. Crie seu chá em minutos!
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={handleSignIn}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-base cursor-pointer"
            >
              Entrar com Google para criar meu planejamento
              <Heart className="h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Sem cartão de crédito necessário
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

