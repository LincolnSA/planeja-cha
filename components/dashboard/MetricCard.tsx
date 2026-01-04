import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  variant?: "default" | "green";
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
        variant === "green" && "bg-green-600 border-green-600 text-white"
      )}
    >
      <div className="flex flex-col gap-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            variant === "green"
              ? "bg-white/20"
              : "bg-green-100"
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              variant === "green" ? "text-white" : "text-green-600"
            )}
          />
        </div>
        <div>
          <div
            className={cn(
              "text-3xl font-bold",
              variant === "green" ? "text-white" : "text-foreground"
            )}
          >
            {value}
          </div>
          <div
            className={cn(
              "text-sm",
              variant === "green" ? "text-white/90" : "text-muted-foreground"
            )}
          >
            {label}
          </div>
        </div>
      </div>
    </Card>
  );
}

