import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GuestsSummaryProps {
  confirmed: number;
  total: number;
  totalPeople: number;
  onAddGuest?: () => void;
}

export function GuestsSummary({
  confirmed,
  total,
  totalPeople,
  onAddGuest,
}: GuestsSummaryProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-muted-foreground">
          Total de pessoas:{" "}
          <span className="font-medium text-green-600">{totalPeople}</span>{" "}
          (convidados + acompanhantes)
        </p>
      </div>
      <Button
        onClick={onAddGuest}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar convidado
      </Button>
    </div>
  );
}

