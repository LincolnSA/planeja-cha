import { Baby, Send, CheckCircle2, Gift } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Baby,
    title: "Crie seu chá",
    description:
      "Configure os detalhes do seu chá de bebê: data, local, mensagem especial e muito mais.",
  },
  {
    number: "02",
    icon: Send,
    title: "Convide seus amigos",
    description:
      "Compartilhe o link exclusivo do convite com familiares e amigos queridos.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Receba confirmações",
    description:
      "Acompanhe em tempo real quem confirmou presença no seu chá especial.",
  },
  {
    number: "04",
    icon: Gift,
    title: "Gerencie presentes",
    description:
      "Veja quais presentes já foram escolhidos e prepare-se para a chegada do bebê.",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-6 text-center">
            <span className="inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-gray-700">
              Como funciona
            </span>
          </div>

          {/* Title */}
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Simples assim, em{" "}
            <span className="text-green-600">4 passos</span>
          </h2>

          {/* Subtitle */}
          <p className="mb-12 text-center text-lg text-muted-foreground">
            Organize tudo de forma prática e tenha mais tempo para curtir esse
            momento especial.
          </p>

          {/* Steps */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-green-200 md:block" />

            <div className="grid gap-8 md:grid-cols-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Number circle */}
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                        <span className="text-lg font-semibold">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Card */}
                    <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

