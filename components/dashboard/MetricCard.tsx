import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  variant?: "default" | "orange";
}

export function MetricCard({
  icon: Icon,
  value,
  label,
  variant = "default",
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "p-6",
        variant === "orange" && "bg-orange-600 border-orange-600 text-white"
      )}
    >
      <div className="flex flex-col gap-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            variant === "orange"
              ? "bg-white/20"
              : "bg-orange-100"
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              variant === "orange" ? "text-white" : "text-orange-600"
            )}
          />
        </div>
        <div>
          <div
            className={cn(
              "text-3xl font-bold",
              variant === "orange" ? "text-white" : "text-foreground"
            )}
          >
            {value}
          </div>
          <div
            className={cn(
              "text-sm",
              variant === "orange" ? "text-white/90" : "text-muted-foreground"
            )}
          >
            {label}
          </div>
        </div>
      </div>
    </Card>
  );
}

