"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, User } from "lucide-react";
import type { CustomGiftListItem } from "@/actions/gift";

interface CustomGiftsListProps {
  customGifts: CustomGiftListItem[];
}

export function CustomGiftsList({ customGifts }: CustomGiftsListProps) {
  if (customGifts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-orange-600" />
            Presentes Personalizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum presente personalizado cadastrado ainda.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-orange-600" />
          Presentes Personalizados ({customGifts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customGifts.map((customGift) => (
            <div
              key={customGift.id}
              className="flex flex-col gap-2 p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground break-words">
                    {customGift.title}
                  </h3>
                  {customGift.description && (
                    <p className="text-sm text-muted-foreground mt-1 break-words">
                      {customGift.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{customGift.guestName}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

