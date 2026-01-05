"use server";

import { prisma } from "@/lib/prisma";
import type { Gift } from "./types";

export interface CreateGiftData {
  title: string;
  description: string;
  quantity: number;
  teaId: string;
}

/**
 * Cria um Gift no banco de dados
 * Responsabilidade única: persistência no banco de dados
 */
export async function createGiftInDb(data: CreateGiftData): Promise<Gift> {
  const gift = await prisma.gift.create({
    data: {
      title: data.title,
      description: data.description,
      quantity: data.quantity,
      chosen: 0, // Sempre começa com 0
      teaId: data.teaId,
    },
  });

  return {
    id: gift.id,
    title: gift.title,
    description: gift.description,
    quantity: gift.quantity,
    chosen: gift.chosen,
    teaId: gift.teaId,
    createdAt: gift.createdAt,
    updatedAt: gift.updatedAt,
  };
}

