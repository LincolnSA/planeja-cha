export function generateInviteLink(teaId: string): string {
  // Priorizar APP_URL (variável de ambiente do servidor)
  // Se não existir, usar NEXT_PUBLIC_APP_URL como fallback
  const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  // Garantir que a URL não tenha barra no final
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  return `${cleanBaseUrl}/convite/${teaId}`;
}

