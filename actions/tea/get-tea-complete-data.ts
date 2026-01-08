"use server";

import { verifyTeaOwnership } from "../gift/verify-tea-ownership";
import { prisma } from "@/lib/prisma";

export interface TeaCompleteData {
  id: string;
  name: string;
  parentsName: string;
  date: string;
  time: string;
  location: string;
  customMessage: string;
  maxCompanionsPerGuest: number;
  guests: {
    id: string;
    name: string;
    companions: {
      id: string;
      name: string;
    }[];
    giftSelections: {
      id: string;
      gift: {
        id: string;
        title: string;
        description: string;
      };
    }[];
    customGifts: {
      id: string;
      title: string;
      description: string | null;
    }[];
  }[];
  gifts: {
    id: string;
    title: string;
    description: string;
    quantity: number;
    chosen: number;
  }[];
}

/**
 * Busca todos os dados completos de um Tea para geração de PDF
 * Responsabilidade única: buscar todos os dados do chá para exportação
 */
export async function getTeaCompleteData(teaId: string): Promise<TeaCompleteData | null> {
  // Verificar se o tea pertence ao usuário
  const isOwner = await verifyTeaOwnership(teaId);
  if (!isOwner) {
    return null;
  }

  const tea = await prisma.tea.findUnique({
    where: { id: teaId },
    include: {
      guests: {
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
        },
        orderBy: { createdAt: "asc" },
      },
      gifts: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!tea) {
    return null;
  }

  // Formatar o time para HH:MM
  const formatTime = (time: Date): string => {
    const hours = String(time.getUTCHours()).padStart(2, "0");
    const minutes = String(time.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return {
    id: tea.id,
    name: tea.name,
    parentsName: tea.parentsName,
    date: tea.date,
    time: formatTime(tea.time),
    location: tea.location,
    customMessage: tea.customMessage,
    maxCompanionsPerGuest: tea.maxCompanionsPerGuest,
    guests: tea.guests.map((guest) => ({
      id: guest.id,
      name: guest.name,
      companions: guest.companions.map((c) => ({
        id: c.id,
        name: c.name,
      })),
      giftSelections: guest.giftSelections.map((gs) => ({
        id: gs.id,
        gift: {
          id: gs.gift.id,
          title: gs.gift.title,
          description: gs.gift.description,
        },
      })),
      customGifts: guest.customGifts.map((cg) => ({
        id: cg.id,
        title: cg.title,
        description: cg.description,
      })),
    })),
    gifts: tea.gifts.map((gift) => ({
      id: gift.id,
      title: gift.title,
      description: gift.description,
      quantity: gift.quantity,
      chosen: gift.chosen,
    })),
  };
}

