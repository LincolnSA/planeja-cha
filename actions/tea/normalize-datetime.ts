export function normalizeDateTime(date: string, time: string | Date): Date {
  if (time instanceof Date) {
    return time;
  }

  // Se time é uma string no formato HH:MM
  if (typeof time === "string" && /^\d{2}:\d{2}$/.test(time)) {
    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
  }

  // Se time é uma string ISO datetime
  if (typeof time === "string") {
    return new Date(time);
  }

  throw new Error("Formato de horário inválido");
}

