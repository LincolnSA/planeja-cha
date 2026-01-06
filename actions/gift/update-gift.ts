"use server";

import { z } from "zod";
import { verifyTeaOwnership } from "./verify-tea-ownership";
import { prisma } from "@/lib/prisma";
import type { Gift } from "./types";

export interface UpdateGiftInput {
  title?: string;
  description?: string;
  quantity?: number;
}

const updateGiftSchema = z.object({
  title: z
    .string()
    .min(1, "O título do presente é obrigatório")
    .max(200, "O título do presente deve ter no máximo 200 caracteres")
    .optional(),

  description: z
    .string()
    .min(1, "A descrição do presente é obrigatória")
    .max(1000, "A descrição do presente deve ter no máximo 1000 caracteres")
    .optional(),

  quantity: z
    .number()
    .int("A quantidade deve ser um número inteiro")
    .min(1, "A quantidade deve ser no mínimo 1")
    .max(1000, "A quantidade não pode ser maior que 1000")
    .optional(),
});

/**
 * Atualiza um Gift existente
 * Responsabilidade única: atualizar presente no banco
 */
export async function updateGift(
  giftId: string,
  input: unknown
): Promise<Gift | null> {
  // Validar input
  const validationResult = updateGiftSchema.safeParse(input);
  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    throw new Error(
      firstError?.message || "Erro de validação nos dados fornecidos"
    );
  }

  const updateData = validationResult.data;

  // Verificar se o gift existe e pertence a um tea do usuário
  const existingGift = await prisma.gift.findUnique({
    where: { id: giftId },
    include: { tea: true },
  });

  if (!existingGift) {
    return null;
  }

  // Verificar se o tea pertence ao usuário
  const isOwner = await verifyTeaOwnership(existingGift.teaId);
  if (!isOwner) {
    return null;
  }

  // Se a quantidade for reduzida, ajustar o chosen se necessário
  const newQuantity = updateData.quantity ?? existingGift.quantity;
  const newChosen = Math.min(existingGift.chosen, newQuantity);

  // Atualizar no banco
  const updatedGift = await prisma.gift.update({
    where: { id: giftId },
    data: {
      ...updateData,
      chosen: newChosen,
    },
  });

  return {
    id: updatedGift.id,
    title: updatedGift.title,
    description: updatedGift.description,
    quantity: updatedGift.quantity,
    chosen: updatedGift.chosen,
    teaId: updatedGift.teaId,
    createdAt: updatedGift.createdAt,
    updatedAt: updatedGift.updatedAt,
  };
}

