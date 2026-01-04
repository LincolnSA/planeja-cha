"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Gift {
  id: string;
  title: string;
  description: string;
  quantity: number;
  chosen: number;
}

interface GiftCardProps {
  gift: Gift;
  onEdit?: (gift: Gift) => void;
  onDelete?: (gift: Gift) => void;
}

export function GiftCard({ gift, onEdit, onDelete }: GiftCardProps) {
  const remaining = gift.quantity - gift.chosen;
  const progress = gift.quantity > 0 ? (gift.chosen / gift.quantity) * 100 : 0;

  return (
    <Card className="relative">
      <CardContent className="p-6">
        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(gift)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(gift)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 pr-20">
          {gift.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">
          {gift.description}
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {gift.chosen} de {gift.quantity} escolhidos
            </span>
            <span className="text-muted-foreground">
              {remaining} restantes
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

