"use server";

import { verifyTeaOwnership } from "../gift/verify-tea-ownership";
import { prisma } from "@/lib/prisma";

export interface GuestDetails {
  id: string;
  name: string;
  teaId: string;
  createdAt: Date;
  updatedAt: Date;
  companions: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  giftSelections: {
    id: string;
    gift: {
      id: string;
      title: string;
      description: string;
    };
    createdAt: Date;
  }[];
  customGifts: {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

/**
 * Busca um Guest com todos os seus dados relacionados
 * Responsabilidade única: buscar dados completos do convidado
 */
export async function getGuestById(guestId: string): Promise<GuestDetails | null> {
  const guest = await prisma.guest.findUnique({
    where: { id: guestId },
    include: {
      companions: {
        orderBy: { createdAt: "asc" },
      },
      giftSelections: {
        include: {
          gift: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      customGifts: {
        orderBy: { createdAt: "asc" },
      },
      tea: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!guest) {
    return null;
  }

  // Verificar se o tea pertence ao usuário
  const isOwner = await verifyTeaOwnership(guest.teaId);
  if (!isOwner) {
    return null;
  }

  return {
    id: guest.id,
    name: guest.name,
    teaId: guest.teaId,
    createdAt: guest.createdAt,
    updatedAt: guest.updatedAt,
    companions: guest.companions.map((c) => ({
      id: c.id,
      name: c.name,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
    giftSelections: guest.giftSelections.map((gs) => ({
      id: gs.id,
      gift: {
        id: gs.gift.id,
        title: gs.gift.title,
        description: gs.gift.description,
      },
      createdAt: gs.createdAt,
    })),
    customGifts: guest.customGifts.map((cg) => ({
      id: cg.id,
      title: cg.title,
      description: cg.description,
      createdAt: cg.createdAt,
      updatedAt: cg.updatedAt,
    })),
  };
}

