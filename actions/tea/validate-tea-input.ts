import { z } from "zod";

export interface CreateTeaInput {
  name: string;
  parentsName: string;
  date: string;
  time: string | Date;
  location: string;
  customMessage: string;
  maxCompanionsPerGuest: number;
}

const createTeaSchema = z.object({
  name: z
    .string()
    .min(1, "O nome do evento é obrigatório")
    .max(100, "O nome do evento deve ter no máximo 100 caracteres"),

  parentsName: z
    .string()
    .min(1, "O nome dos pais é obrigatório")
    .max(200, "O nome dos pais deve ter no máximo 200 caracteres"),

  date: z
    .string()
    .min(1, "A data é obrigatória")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "A data deve estar no formato YYYY-MM-DD"),

  time: z.union([
    z.string().datetime(),
    z.date(),
    z.string().regex(/^\d{2}:\d{2}$/, "O horário deve estar no formato HH:MM"),
  ]),

  location: z
    .string()
    .min(1, "A localização é obrigatória")
    .max(500, "A localização deve ter no máximo 500 caracteres"),

  customMessage: z
    .string()
    .max(1000, "A mensagem personalizada deve ter no máximo 1000 caracteres")
    .default(""),

  maxCompanionsPerGuest: z
    .number()
    .int("O número máximo de acompanhantes deve ser um número inteiro")
    .min(0, "O número máximo de acompanhantes não pode ser negativo")
    .max(20, "O número máximo de acompanhantes não pode ser maior que 20")
    .default(5),
});

export function validateTeaInput(input: unknown): CreateTeaInput {
  const result = createTeaSchema.safeParse(input);

  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new Error(
      firstError?.message || "Erro de validação nos dados fornecidos"
    );
  }

  return result.data as CreateTeaInput;
}

