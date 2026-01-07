"use server";

import { verifyTeaOwnership } from "../gift/verify-tea-ownership";
import { prisma } from "@/lib/prisma";

export interface GuestListItem {
  id: string;
  name: string;
  companionsTotal: number;
  companions: string[]; // Nomes dos acompanhantes
  giftsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Busca todos os Guests de um Tea específico com contagem de acompanhantes e presentes
 * Responsabilidade única: buscar lista de convidados do banco
 */
export async function getGuests(teaId: string): Promise<GuestListItem[]> {
  // Verificar se o tea pertence ao usuário
  const isOwner = await verifyTeaOwnership(teaId);
  if (!isOwner) {
    return [];
  }

  const guests = await prisma.guest.findMany({
    where: {
      teaId,
    },
    include: {
      companions: true,
      giftSelections: true,
      customGifts: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return guests.map((guest) => ({
    id: guest.id,
    name: guest.name,
    companionsTotal: guest.companions.length,
    companions: guest.companions.map((c) => c.name),
    giftsCount: guest.giftSelections.length + guest.customGifts.length,
    createdAt: guest.createdAt,
    updatedAt: guest.updatedAt,
  }));
}

