"use server";

import { getCurrentUserId } from "../tea/get-current-user-id";
import { prisma } from "@/lib/prisma";

/**
 * Verifica se o tea pertence ao usuário autenticado
 * Responsabilidade única: verificar propriedade do tea
 */
export async function verifyTeaOwnership(teaId: string): Promise<boolean> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return false;
  }

  const tea = await prisma.tea.findFirst({
    where: {
      id: teaId,
      userId,
    },
  });

  return !!tea;
}

