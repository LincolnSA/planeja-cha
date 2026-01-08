export function normalizeDateTime(date: string, time: string | Date): Date {
  if (time instanceof Date) {
    return time;
  }

  // Se time é uma string no formato HH:MM
  if (typeof time === "string" && /^\d{2}:\d{2}$/.test(time)) {
    const [hours, minutes] = time.split(":").map(Number);
    // Cria uma string ISO no formato YYYY-MM-DDTHH:MM:SS e cria Date em UTC
    // Isso garante que o horário seja salvo exatamente como informado, sem conversão de timezone
    const dateTime = new Date(`${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00Z`);
    return dateTime;
  }

  // Se time é uma string ISO datetime
  if (typeof time === "string") {
    return new Date(time);
  }

  throw new Error("Formato de horário inválido");
}

