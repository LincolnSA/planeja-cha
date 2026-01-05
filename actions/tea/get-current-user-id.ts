import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await auth();

    if (!session?.user) {
      console.error("getCurrentUserId: Nenhuma sessão encontrada");
      return null;
    }

    // NextAuth v5 com callback deve retornar o ID diretamente
    const userId = (session.user as any).id;

    if (userId) {
      return userId;
    }

    // Se não temos o ID diretamente, buscamos pelo email
    if (session.user.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });

      if (user?.id) {
        return user.id;
      }

      console.error("getCurrentUserId: Usuário não encontrado no banco pelo email");
    }

    console.error("getCurrentUserId: Não foi possível obter o ID do usuário");
    return null;
  } catch (error) {
    console.error("getCurrentUserId: Erro ao obter ID do usuário", error);
    return null;
  }
}

