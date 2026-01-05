"use server";

import { verifyTeaOwnership } from "./verify-tea-ownership";
import { prisma } from "@/lib/prisma";

/**
 * Deleta um Gift
 * Responsabilidade única: deletar presente do banco
 */
export async function deleteGift(giftId: string): Promise<boolean> {
  // Verificar se o gift existe e pertence a um tea do usuário
  const existingGift = await prisma.gift.findUnique({
    where: { id: giftId },
    include: { tea: true },
  });

  if (!existingGift) {
    return false;
  }

  // Verificar se o tea pertence ao usuário
  const isOwner = await verifyTeaOwnership(existingGift.teaId);
  if (!isOwner) {
    return false;
  }

  // Verificar se o presente já foi escolhido
  if (existingGift.chosen > 0) {
    throw new Error("Não é possível deletar um presente que já foi escolhido por convidados. Para manter a integridade dos dados, apenas presentes não escolhidos podem ser deletados.");
  }

  // Deletar o gift
  await prisma.gift.delete({
    where: { id: giftId },
  });

  return true;
}

