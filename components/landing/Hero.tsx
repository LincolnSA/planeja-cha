"use client";

import { Button } from "@/components/ui/button";
import { Clock, Heart } from "lucide-react";
import { signIn } from "next-auth/react";

export function Hero() {
  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <section className="w-full bg-background py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              A forma mais especial de celebrar
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Organize seu{" "}
            <span className="font-[family-name:var(--font-serif)] italic text-green-600">
              Chá de Bebê
            </span>{" "}
            com carinho e praticidade
          </h1>

          {/* Description */}
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            Crie convites personalizados, gerencie sua lista de presentes e
            confirme a presença dos convidados — tudo em um só lugar.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={handleSignIn}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-base cursor-pointer"
            >
              Entrar com Google para criar meu planejamento
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

