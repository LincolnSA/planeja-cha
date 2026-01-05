"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

/**
 * Converte data do formato YYYY-MM-DD para DD/MM/YYYY
 */
function formatDateForDisplay(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString + "T00:00:00");
  if (isNaN(date.getTime())) return dateString;
  
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Converte data do formato DD/MM/YYYY para YYYY-MM-DD
 */
function parseDateFromDisplay(displayValue: string): string {
  if (!displayValue) return "";
  
  // Se já está no formato YYYY-MM-DD, retorna como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(displayValue)) {
    return displayValue;
  }
  
  // Tenta parsear DD/MM/YYYY
  const parts = displayValue.split("/");
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  
  return displayValue;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, value, onChange, placeholder = "DD/MM/AAAA", ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(() => {
      return value ? formatDateForDisplay(value) : "";
    });
    const [isFocused, setIsFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const nativeInputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (value) {
        setDisplayValue(formatDateForDisplay(value));
      } else {
        setDisplayValue("");
      }
    }, [value]);

    const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setDisplayValue(newValue);
    };

    const handleDisplayBlur = () => {
      setIsFocused(false);
      if (displayValue) {
        const parsed = parseDateFromDisplay(displayValue);
        if (parsed && /^\d{4}-\d{2}-\d{2}$/.test(parsed)) {
          onChange?.(parsed);
          setDisplayValue(formatDateForDisplay(parsed));
        } else {
          // Se não conseguiu parsear, tenta restaurar o valor original
          if (value) {
            setDisplayValue(formatDateForDisplay(value));
          } else {
            setDisplayValue("");
          }
        }
      }
    };

    const handleDisplayFocus = () => {
      setIsFocused(true);
      // Quando foca, abre o datepicker nativo
      setTimeout(() => {
        nativeInputRef.current?.showPicker?.();
      }, 100);
    };

    const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (newValue) {
        onChange?.(newValue);
        setDisplayValue(formatDateForDisplay(newValue));
      }
    };

    return (
      <div className="relative">
        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleDisplayChange}
          onFocus={handleDisplayFocus}
          onBlur={handleDisplayBlur}
          placeholder={placeholder}
          className={cn("pl-10", className)}
          {...props}
        />
        <input
          ref={nativeInputRef}
          type="date"
          value={value || ""}
          onChange={handleNativeChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          style={{ pointerEvents: isFocused ? "auto" : "none" }}
        />
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };

