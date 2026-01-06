import { Users, Gift, Heart } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Convites Digitais",
    description:
      "Envie convites elegantes com link exclusivo para cada convidado",
  },
  {
    icon: Gift,
    title: "Lista de Presentes",
    description:
      "Organize sua lista e deixe os convidados escolherem o presente ideal",
  },
  {
    icon: Heart,
    title: "Confirmação Fácil",
    description:
      "Acompanhe quem confirmou presença em tempo real",
  },
];

export function Features() {
  return (
    <section className="w-full bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-lg bg-card p-6 shadow-sm border border-border"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <Icon className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

