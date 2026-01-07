"use server";

import { verifyTeaOwnership } from "./verify-tea-ownership";
import { prisma } from "@/lib/prisma";

export interface CustomGiftListItem {
  id: string;
  title: string;
  description: string | null;
  guestName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Busca todos os CustomGifts de um Tea específico
 * Responsabilidade única: buscar presentes personalizados do banco
 */
export async function getCustomGifts(teaId: string): Promise<CustomGiftListItem[]> {
  // Verificar se o tea pertence ao usuário
  const isOwner = await verifyTeaOwnership(teaId);
  if (!isOwner) {
    return [];
  }

  const customGifts = await prisma.customGift.findMany({
    where: {
      guest: {
        teaId,
      },
    },
    include: {
      guest: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return customGifts.map((customGift) => ({
    id: customGift.id,
    title: customGift.title,
    description: customGift.description,
    guestName: customGift.guest.name,
    createdAt: customGift.createdAt,
    updatedAt: customGift.updatedAt,
  }));
}

