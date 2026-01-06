"use client";

import { GiftCard } from "./GiftCard";
import type { Gift } from "@/actions/gift";

interface GiftsGridProps {
  gifts: Gift[];
  onEdit?: (gift: Gift) => void;
  onDelete?: (gift: Gift) => void;
}

export function GiftsGrid({ gifts, onEdit, onDelete }: GiftsGridProps) {
  if (gifts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhum presente cadastrado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {gifts.map((gift) => (
        <GiftCard
          key={gift.id}
          gift={gift}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

