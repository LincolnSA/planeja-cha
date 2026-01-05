"use server";

import { getCurrentUserId } from "./get-current-user-id";
import { prisma } from "@/lib/prisma";

export async function deleteTea(teaId: string): Promise<boolean> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return false;
  }

  // Verifica se o tea existe e pertence ao usuário
  const existingTea = await prisma.tea.findFirst({
    where: {
      id: teaId,
      userId,
    },
  });

  if (!existingTea) {
    return false;
  }

  await prisma.tea.delete({
    where: { id: teaId },
  });

  return true;
}

