"use client";

import * as React from "react";
import { Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimePickerProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

/**
 * Gera array de horários de 05:00 até 00:00 (meia-noite) com intervalos de 30 minutos
 */
function generateTimeOptions(): string[] {
  const times: string[] = [];
  
  // De 05:00 até 23:30
  for (let hour = 5; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hourStr = String(hour).padStart(2, "0");
      const minuteStr = String(minute).padStart(2, "0");
      times.push(`${hourStr}:${minuteStr}`);
    }
  }
  
  // Adiciona 00:00 (meia-noite)
  times.push("00:00");
  
  return times;
}

const TimePicker = React.forwardRef<HTMLSelectElement, TimePickerProps>(
  ({ className, value, onChange, placeholder = "Selecione o horário", ...props }, ref) => {
    const timeOptions = React.useMemo(() => generateTimeOptions(), []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className="relative">
        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <select
          ref={ref}
          value={value || ""}
          onChange={handleChange}
          className={cn(
            "w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pl-10 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            !value && "text-muted-foreground",
            className
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
      </div>
    );
  }
);

TimePicker.displayName = "TimePicker";

export { TimePicker };

