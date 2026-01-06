import { z } from "zod";

export interface CreateGiftInput {
  title: string;
  description: string;
  quantity: number;
  teaId: string;
}

const createGiftSchema = z.object({
  title: z
    .string()
    .min(1, "O título do presente é obrigatório")
    .max(200, "O título do presente deve ter no máximo 200 caracteres"),

  description: z
    .string()
    .min(1, "A descrição do presente é obrigatória")
    .max(1000, "A descrição do presente deve ter no máximo 1000 caracteres"),

  quantity: z
    .number()
    .int("A quantidade deve ser um número inteiro")
    .min(1, "A quantidade deve ser no mínimo 1")
    .max(1000, "A quantidade não pode ser maior que 1000"),

  teaId: z
    .string()
    .min(1, "O ID do chá é obrigatório"),
});

export function validateGiftInput(input: unknown): CreateGiftInput {
  const result = createGiftSchema.safeParse(input);

  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new Error(
      firstError?.message || "Erro de validação nos dados fornecidos"
    );
  }

  return result.data as CreateGiftInput;
}

