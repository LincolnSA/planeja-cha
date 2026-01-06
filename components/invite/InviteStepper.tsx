"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface InviteStepperProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Convite" },
  { number: 2, label: "Confirmar" },
  { number: 3, label: "Presente" },
];

export function InviteStepper({ currentStep }: InviteStepperProps) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8 px-4">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isFuture = step.number > currentStep;

        return (
          <div key={step.number} className="flex items-center gap-1 sm:gap-2">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-colors",
                  isCompleted &&
                    "bg-orange-600 text-white",
                  isCurrent &&
                    "bg-orange-600 text-white",
                  isFuture &&
                    "bg-gray-200 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "text-xs sm:text-sm font-medium text-center",
                  isCompleted || isCurrent
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-4 sm:w-8 transition-colors",
                  isCompleted ? "bg-orange-600" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

