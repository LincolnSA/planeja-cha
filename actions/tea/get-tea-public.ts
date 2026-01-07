"use server";

import { prisma } from "@/lib/prisma";

export interface PublicTea {
  id: string;
  name: string;
  parentsName: string;
  date: string;
  time: string; // Formato HH:MM para evitar problemas de hidratação
  location: string;
  customMessage: string;
  giftsInfoMessage: string | null;
  maxCompanionsPerGuest: number;
  isActive: boolean;
  requireGiftSelection: boolean;
}

/**
 * Busca um Tea pelo ID (público, sem verificar autenticação)
 * Responsabilidade única: buscar tea para exibição pública
 */
export async function getTeaPublic(teaId: string): Promise<PublicTea | null> {
  const tea = await prisma.tea.findUnique({
    where: { id: teaId },
  });

  if (!tea) {
    return null;
  }

  // Formatar o time para HH:MM para evitar problemas de hidratação
  const formatTime = (time: Date): string => {
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Formatar a data para DD/MM/YYYY (padrão brasileiro)
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    
    // Se já está no formato DD/MM/YYYY, retorna como está
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }
    
    // Se está no formato YYYY-MM-DD, converte para DD/MM/YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }
    
    // Tenta parsear como Date e formatar
    const date = new Date(dateString + "T00:00:00");
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    
    // Se não conseguiu formatar, retorna como está
    return dateString;
  };

  return {
    id: tea.id,
    name: tea.name,
    parentsName: tea.parentsName,
    date: formatDate(tea.date),
    time: formatTime(tea.time),
    location: tea.location,
    customMessage: tea.customMessage,
    giftsInfoMessage: tea.giftsInfoMessage,
    maxCompanionsPerGuest: tea.maxCompanionsPerGuest,
    isActive: tea.isActive,
    requireGiftSelection: tea.requireGiftSelection,
  };
}

