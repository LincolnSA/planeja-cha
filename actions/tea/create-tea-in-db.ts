import { prisma } from "@/lib/prisma";

export interface CreateTeaData {
  name: string;
  parentsName: string;
  date: string;
  time: Date;
  location: string;
  customMessage: string;
  maxCompanionsPerGuest: number;
  inviteLink: string;
  userId: string;
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
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createTeaInDb(data: CreateTeaData): Promise<Tea> {
  const tea = await prisma.tea.create({
    data: {
      name: data.name,
      parentsName: data.parentsName,
      date: data.date,
      time: data.time,
      location: data.location,
      customMessage: data.customMessage,
      maxCompanionsPerGuest: data.maxCompanionsPerGuest,
      inviteLink: data.inviteLink,
      userId: data.userId,
    },
  });

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
    userId: tea.userId,
    createdAt: tea.createdAt,
    updatedAt: tea.updatedAt,
  };
}

