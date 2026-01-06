"use server";

import { getCurrentUserId } from "./get-current-user-id";
import { prisma } from "@/lib/prisma";
import { normalizeDateTime } from "./normalize-datetime";

export interface UpdateTeaInput {
  name?: string;
  parentsName?: string;
  date?: string;
  time?: string | Date;
  location?: string;
  customMessage?: string;
  maxCompanionsPerGuest?: number;
  isActive?: boolean;
}

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
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function updateTea(
  teaId: string,
  input: UpdateTeaInput
): Promise<Tea | null> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  // Verifica se o tea existe e pertence ao usuário
  const existingTea = await prisma.tea.findFirst({
    where: {
      id: teaId,
      userId,
    },
  });

  if (!existingTea) {
    return null;
  }

  // Prepara os dados para atualização
  const updateData: {
    name?: string;
    parentsName?: string;
    location?: string;
    customMessage?: string;
    maxCompanionsPerGuest?: number;
    isActive?: boolean;
    date?: string;
    time?: Date;
  } = {};

  if (input.name !== undefined) updateData.name = input.name;
  if (input.parentsName !== undefined) updateData.parentsName = input.parentsName;
  if (input.location !== undefined) updateData.location = input.location;
  if (input.customMessage !== undefined) updateData.customMessage = input.customMessage;
  if (input.maxCompanionsPerGuest !== undefined) {
    updateData.maxCompanionsPerGuest = input.maxCompanionsPerGuest;
  }
  if (input.isActive !== undefined) updateData.isActive = input.isActive;

  // Se date ou time foram fornecidos, normaliza o time
  if (input.date !== undefined || input.time !== undefined) {
    const date = input.date || existingTea.date;
    const time = input.time || existingTea.time;
    updateData.time = normalizeDateTime(date, time);
    if (input.date !== undefined) {
      updateData.date = input.date;
    }
  }

  const updatedTea = await prisma.tea.update({
    where: { id: teaId },
    data: updateData,
  });

  return {
    id: updatedTea.id,
    name: updatedTea.name,
    parentsName: updatedTea.parentsName,
    date: updatedTea.date,
    time: updatedTea.time,
    location: updatedTea.location,
    customMessage: updatedTea.customMessage,
    maxCompanionsPerGuest: updatedTea.maxCompanionsPerGuest,
    inviteLink: updatedTea.inviteLink,
    isActive: updatedTea.isActive,
    userId: updatedTea.userId,
    createdAt: updatedTea.createdAt,
    updatedAt: updatedTea.updatedAt,
  };
}

