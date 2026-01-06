import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "Organizamos tudo em menos de uma hora! Os convidados adoraram a facilidade de confirmar presença e escolher os presentes.",
    author: "Ana Carolina",
    role: "Mamãe do Pedro",
    initial: "A",
  },
  {
    text: "O convite digital ficou lindo! Recebi muitos elogios dos convidados. Super recomendo para todas as mamães.",
    author: "Juliana Santos",
    role: "Mamãe da Sofia",
    initial: "J",
  },
  {
    text: "Finalmente um sistema fácil de usar! Consegui acompanhar tudo pelo celular enquanto trabalhava. Perfeito!",
    author: "Mariana Costa",
    role: "Mamãe do Lucas",
    initial: "M",
  },
];

export function Testimonials() {
  return (
    <section className="w-full bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Badge */}
          <div className="mb-6 text-center">
            <span className="inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700">
              Depoimentos
            </span>
          </div>

          {/* Title */}
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Mamães que{" "}
            <span className="text-orange-600">amaram</span>
          </h2>

          {/* Subtitle */}
          <p className="mb-12 text-center text-lg text-muted-foreground">
            Veja o que as mamães estão falando sobre nossa plataforma.
          </p>

          {/* Testimonials Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-lg bg-card p-6 shadow-sm border border-border"
              >
                {/* Quote Icon */}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-orange-600">
                  <Quote className="h-5 w-5 text-white" />
                </div>

                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="mb-6 text-muted-foreground">
                  {testimonial.text}
                </p>

                {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white">
                      <span className="text-sm font-semibold">
                        {testimonial.initial}
                      </span>
                    </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

