"use server";

import { prisma } from "@/lib/prisma";
import type { Gift } from "./types";

/**
 * Busca todos os Gifts de um Tea específico (público, sem verificar ownership)
 * Responsabilidade única: buscar presentes para exibição pública
 */
export async function getGiftsPublic(teaId: string): Promise<Gift[]> {
  // Verificar se o tea existe
  const tea = await prisma.tea.findUnique({
    where: { id: teaId },
  });

  if (!tea) {
    return [];
  }

  const gifts = await prisma.gift.findMany({
    where: {
      teaId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return gifts.map((gift) => ({
    id: gift.id,
    title: gift.title,
    description: gift.description,
    quantity: gift.quantity,
    chosen: gift.chosen,
    teaId: gift.teaId,
    createdAt: gift.createdAt,
    updatedAt: gift.updatedAt,
  }));
}

