"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  className?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center justify-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary appearance-none cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-orange-600 checked:border-orange-600",
            className
          )}
          {...props}
        />
        <Check className="absolute h-3 w-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" />
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };

