"use server";

import { verifyTeaOwnership } from "./verify-tea-ownership";
import { prisma } from "@/lib/prisma";
import type { Gift } from "./types";

/**
 * Busca todos os Gifts de um Tea específico
 * Responsabilidade única: buscar presentes do banco
 */
export async function getGifts(teaId: string): Promise<Gift[]> {
  // Verificar se o tea pertence ao usuário
  const isOwner = await verifyTeaOwnership(teaId);
  if (!isOwner) {
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

