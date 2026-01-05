"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Gift } from "@/actions/gift";

interface SelectedGift {
  id: string | null;
  customGift?: string;
}

interface InviteStep3Props {
  gifts: Gift[];
  onBack: () => void;
  onConfirm: (selectedGifts: SelectedGift[]) => void;
}

export function InviteStep3({
  gifts,
  onBack,
  onConfirm,
}: InviteStep3Props) {
  const [selectedGifts, setSelectedGifts] = useState<Set<string>>(new Set());
  const [customGift, setCustomGift] = useState<string>("");
  const [isCustomSelected, setIsCustomSelected] = useState(false);

  const getGiftStatus = (gift: Gift) => {
    const remaining = gift.quantity - gift.chosen;
    if (remaining === 0) return { label: "Esgotado", variant: "destructive" as const };
    if (remaining <= 2) return { label: "Últimas unidades", variant: "warning" as const };
    return { label: "Disponível", variant: "success" as const };
  };

  const handleGiftToggle = (giftId: string) => {
    setSelectedGifts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(giftId)) {
        newSet.delete(giftId);
      } else {
        newSet.add(giftId);
      }
      return newSet;
    });
  };

  const handleCustomToggle = () => {
    setIsCustomSelected((prev) => {
      if (!prev) {
        // Se está selecionando, mostra o input
        return true;
      } else {
        // Se está desmarcando, limpa o input
        setCustomGift("");
        return false;
      }
    });
  };

  const handleConfirm = () => {
    const selected: SelectedGift[] = [];
    
    // Adiciona presentes selecionados
    selectedGifts.forEach((giftId) => {
      selected.push({ id: giftId });
    });
    
    // Adiciona presente customizado se selecionado e preenchido
    if (isCustomSelected && customGift.trim()) {
      selected.push({ id: null, customGift: customGift.trim() });
    }
    
    onConfirm(selected);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            {gifts.map((gift) => {
              const status = getGiftStatus(gift);
              const remaining = gift.quantity - gift.chosen;
              const isAvailable = remaining > 0;
              const isSelected = selectedGifts.has(gift.id);

              return (
                <div
                  key={gift.id}
                  onClick={() => isAvailable && handleGiftToggle(gift.id)}
                  className={cn(
                    "flex items-start gap-4 rounded-lg border p-4 transition-colors cursor-pointer",
                    isSelected
                      ? "border-green-600 bg-green-50"
                      : "border-border hover:border-green-300",
                    !isAvailable && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={!isAvailable}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (isAvailable) {
                        handleGiftToggle(gift.id);
                      }
                    }}
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Label
                          htmlFor={gift.id}
                          className="text-base font-semibold text-foreground cursor-pointer"
                        >
                          {gift.title}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {gift.description}
                        </p>
                      </div>
                      <Badge variant={status.variant} className="shrink-0">
                        {status.label}
                      </Badge>
                    </div>
                    {isAvailable && (
                      <p className="text-xs text-muted-foreground">
                        {remaining} disponíveis
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Custom Gift Option */}
            <div
              onClick={handleCustomToggle}
              className={cn(
                "flex items-start gap-4 rounded-lg border p-4 transition-colors cursor-pointer hover:border-green-300",
                isCustomSelected
                  ? "border-green-600 bg-green-50"
                  : "border-border"
              )}
            >
              <Checkbox
                checked={isCustomSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  handleCustomToggle();
                }}
                className="mt-1"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Label
                    htmlFor="custom"
                    className="text-base font-semibold text-foreground cursor-pointer"
                  >
                    Outro presente
                  </Label>
                  <Badge variant="success" className="shrink-0">
                    Personalizado
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Digite o presente que você gostaria de dar
                </p>
                {isCustomSelected && (
                  <Input
                    placeholder="Digite o nome do presente"
                    value={customGift}
                    onChange={(e) => setCustomGift(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            Confirmar presença
            <Heart className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onConfirm([])}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          Confirmar sem escolher presente
        </Button>
      </div>
    </div>
  );
}

