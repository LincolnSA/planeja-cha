import { prisma } from "@/lib/prisma";

export async function updateTeaInviteLink(teaId: string, inviteLink: string): Promise<void> {
  await prisma.tea.update({
    where: { id: teaId },
    data: { inviteLink },
  });
}

