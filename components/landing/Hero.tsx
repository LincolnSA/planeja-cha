import { Button } from "@/components/ui/button";
import { Clock, Heart } from "lucide-react";
import Link from "next/link";

export function Hero() {
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
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-base"
            >
              <Link href="/signup" className="flex items-center gap-2">
                Criar meu planejamento de chá
                <Heart className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 text-base"
            >
              <Link href="/example">Ver exemplo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

