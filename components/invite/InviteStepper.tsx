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
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isFuture = step.number > currentStep;

        return (
          <div key={step.number} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isCompleted &&
                    "bg-green-600 text-white",
                  isCurrent &&
                    "bg-green-600 text-white",
                  isFuture &&
                    "bg-gray-200 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
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
                  "h-0.5 w-8 transition-colors",
                  isCompleted ? "bg-green-600" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

