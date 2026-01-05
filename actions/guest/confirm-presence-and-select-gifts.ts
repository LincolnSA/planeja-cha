"use server";

import { prisma } from "@/lib/prisma";

export interface ConfirmPresenceAndSelectGiftsInput {
  teaId: string;
  guestName: string;
  companions: string[]; // Array de nomes dos acompanhantes
  giftIds: string[]; // IDs dos presentes escolhidos da lista
  customGifts: Array<{ title: string; description?: string }>; // Presentes customizados
}

export interface ConfirmPresenceAndSelectGiftsResult {
  success: boolean;
  guestId?: string;
  error?: string;
}

/**
 * Confirma presença e seleciona presentes em uma única transação
 * Responsabilidade única: criar convidado, acompanhantes e seleções de presentes
 */
export async function confirmPresenceAndSelectGifts(
  input: ConfirmPresenceAndSelectGiftsInput
): Promise<ConfirmPresenceAndSelectGiftsResult> {
  try {
    // Verificar se o tea existe
    const tea = await prisma.tea.findUnique({
      where: { id: input.teaId },
      select: { id: true, maxCompanionsPerGuest: true },
    });

    if (!tea) {
      return {
        success: false,
        error: "Chá de bebê não encontrado",
      };
    }

    // Verificar se não excede o máximo de acompanhantes
    if (input.companions.length > tea.maxCompanionsPerGuest) {
      return {
        success: false,
        error: `Máximo de ${tea.maxCompanionsPerGuest} acompanhantes permitidos`,
      };
    }

    // Verificar se os gifts existem e pertencem ao mesmo tea
    if (input.giftIds.length > 0) {
      const gifts = await prisma.gift.findMany({
        where: {
          id: { in: input.giftIds },
          teaId: input.teaId,
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

    // Criar tudo em uma única transação
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar o guest
      const guest = await tx.guest.create({
        data: {
          name: input.guestName.trim(),
          teaId: input.teaId,
        },
      });

      // 2. Criar os companions (apenas os que têm nome preenchido)
      const validCompanions = input.companions
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      if (validCompanions.length > 0) {
        await tx.companion.createMany({
          data: validCompanions.map((name) => ({
            name,
            guestId: guest.id,
          })),
        });
      }

      // 3. Criar seleções de presentes da lista
      if (input.giftIds.length > 0) {
        await tx.guestGiftSelection.createMany({
          data: input.giftIds.map((giftId) => ({
            guestId: guest.id,
            giftId,
          })),
          skipDuplicates: true,
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

      // 4. Criar presentes customizados
      if (input.customGifts.length > 0) {
        await tx.customGift.createMany({
          data: input.customGifts.map((cg) => ({
            title: cg.title.trim(),
            description: cg.description?.trim() || null,
            guestId: guest.id,
          })),
        });
      }

      return guest;
    });

    return {
      success: true,
      guestId: result.id,
    };
  } catch (error) {
    console.error("Erro ao confirmar presença e selecionar presentes:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao confirmar presença e selecionar presentes",
    };
  }
}

