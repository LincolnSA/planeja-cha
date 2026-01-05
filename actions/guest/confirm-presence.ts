"use server";

import { prisma } from "@/lib/prisma";

export interface ConfirmPresenceInput {
  teaId: string;
  guestName: string;
  companions: string[]; // Array de nomes dos acompanhantes
}

export interface ConfirmPresenceResult {
  success: boolean;
  guestId?: string;
  error?: string;
}

/**
 * Confirma presença criando um Guest e seus Companions
 * Responsabilidade única: criar convidado e acompanhantes
 */
export async function confirmPresence(
  input: ConfirmPresenceInput
): Promise<ConfirmPresenceResult> {
  try {
    // Verificar se o tea existe
    const tea = await prisma.tea.findUnique({
      where: { id: input.teaId },
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

    // Criar o guest e seus companions em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar o guest
      const guest = await tx.guest.create({
        data: {
          name: input.guestName.trim(),
          teaId: input.teaId,
        },
      });

      // Criar os companions (apenas os que têm nome preenchido)
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

      return guest;
    });

    return {
      success: true,
      guestId: result.id,
    };
  } catch (error) {
    console.error("Erro ao confirmar presença:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao confirmar presença",
    };
  }
}

