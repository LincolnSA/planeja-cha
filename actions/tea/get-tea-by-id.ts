"use server";

import { getCurrentUserId } from "./get-current-user-id";
import { prisma } from "@/lib/prisma";

export interface Tea {
  id: string;
  name: string;
  parentsName: string;
  date: string;
  time: Date;
  location: string;
  customMessage: string;
  maxCompanionsPerGuest: number;
  inviteLink: string;
  isActive: boolean;
  requireGiftSelection: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getTeaById(teaId: string): Promise<Tea | null> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const tea = await prisma.tea.findFirst({
    where: {
      id: teaId,
      userId, // Garante que o tea pertence ao usuário
    },
  });

  if (!tea) {
    return null;
  }

  return {
    id: tea.id,
    name: tea.name,
    parentsName: tea.parentsName,
    date: tea.date,
    time: tea.time,
    location: tea.location,
    customMessage: tea.customMessage,
    maxCompanionsPerGuest: tea.maxCompanionsPerGuest,
    inviteLink: tea.inviteLink,
    isActive: tea.isActive,
    requireGiftSelection: tea.requireGiftSelection,
    userId: tea.userId,
    createdAt: tea.createdAt,
    updatedAt: tea.updatedAt,
  };
}

