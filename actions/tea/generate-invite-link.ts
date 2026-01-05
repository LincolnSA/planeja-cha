export function generateInviteLink(teaId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/convite/${teaId}`;
}

