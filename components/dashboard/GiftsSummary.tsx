import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GiftsSummaryProps {
  chosen: number;
  total: number;
  onAddGift?: () => void;
}

export function GiftsSummary({
  chosen,
  total,
  onAddGift,
}: GiftsSummaryProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {chosen} de {total} presentes escolhidos
        </span>
      </p>
      <Button
        onClick={onAddGift}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar presente
      </Button>
    </div>
  );
}

