"use server";

import { prisma } from "@/lib/prisma";

export interface SelectGiftsInput {
  guestId: string;
  giftIds: string[]; // IDs dos presentes escolhidos da lista
  customGifts: Array<{ title: string; description?: string }>; // Presentes customizados
}

export interface SelectGiftsResult {
  success: boolean;
  error?: string;
}

/**
 * Seleciona presentes para um guest
 * Responsabilidade única: criar seleções de presentes e presentes customizados
 */
export async function selectGifts(
  input: SelectGiftsInput
): Promise<SelectGiftsResult> {
  try {
    // Verificar se o guest existe
    const guest = await prisma.guest.findUnique({
      where: { id: input.guestId },
      include: { tea: true },
    });

    if (!guest) {
      return {
        success: false,
        error: "Convidado não encontrado",
      };
    }

    // Verificar se os gifts existem e pertencem ao mesmo tea
    if (input.giftIds.length > 0) {
      const gifts = await prisma.gift.findMany({
        where: {
          id: { in: input.giftIds },
          teaId: guest.teaId,
        },
      });

      if (gifts.length !== input.giftIds.length) {
        return {
          success: false,
          error: "Um ou mais presentes não foram encontrados",
        };
      }

      // Verificar disponibilidade dos presentes
      for (const gift of gifts) {
        const remaining = gift.quantity - gift.chosen;
        if (remaining <= 0) {
          return {
            success: false,
            error: `O presente "${gift.title}" está esgotado`,
          };
        }
      }
    }

    // Criar seleções e presentes customizados em uma transação
    await prisma.$transaction(async (tx) => {
      // Criar seleções de presentes da lista
      if (input.giftIds.length > 0) {
        await tx.guestGiftSelection.createMany({
          data: input.giftIds.map((giftId) => ({
            guestId: input.guestId,
            giftId,
          })),
          skipDuplicates: true, // Evita erro se já existir
        });

        // Atualizar o contador "chosen" de cada presente
        for (const giftId of input.giftIds) {
          await tx.gift.update({
            where: { id: giftId },
            data: {
              chosen: {
                increment: 1,
              },
            },
          });
        }
      }

      // Criar presentes customizados
      if (input.customGifts.length > 0) {
        await tx.customGift.createMany({
          data: input.customGifts.map((cg) => ({
            title: cg.title.trim(),
            description: cg.description?.trim() || null,
            guestId: input.guestId,
          })),
        });
      }
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erro ao selecionar presentes:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao selecionar presentes",
    };
  }
}

