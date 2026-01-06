"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Gift } from "lucide-react";
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-orange-100 shrink-0">
          <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
        </div>
        <h2 className="text-center text-xl sm:text-2xl font-bold text-foreground">
          Escolha os Presentes
        </h2>
        <p className="text-center text-sm sm:text-base text-muted-foreground">
          Selecione um ou mais presentes para o bebê
        </p>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="space-y-3 sm:space-y-4">
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
                    "flex items-start gap-2 sm:gap-3 md:gap-4 rounded-lg border p-3 sm:p-4 transition-colors",
                    isSelected
                      ? "border-orange-600 bg-orange-50"
                      : "border-border",
                    isAvailable
                      ? "cursor-pointer hover:border-orange-300"
                      : "opacity-60 cursor-not-allowed"
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
                    className="mt-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={gift.id}
                          className={cn(
                            "text-sm sm:text-base font-semibold cursor-pointer block break-words",
                            isAvailable ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {gift.title}
                        </Label>
                        {gift.description && (
                          <p className={cn(
                            "text-xs sm:text-sm mt-1 break-words",
                            isAvailable ? "text-muted-foreground" : "text-muted-foreground/70"
                          )}>
                            {gift.description}
                          </p>
                        )}
                      </div>
                      <Badge variant={status.variant} className="shrink-0 text-xs">
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isAvailable ? `${remaining} disponíveis` : "Esgotado"}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Custom Gift Option */}
            <div
              onClick={handleCustomToggle}
              className={cn(
                "flex items-start gap-2 sm:gap-3 md:gap-4 rounded-lg border p-3 sm:p-4 transition-colors cursor-pointer hover:border-orange-300",
                isCustomSelected
                  ? "border-orange-600 bg-orange-50"
                  : "border-border"
              )}
            >
              <Checkbox
                checked={isCustomSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  handleCustomToggle();
                }}
                className="mt-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Label
                    htmlFor="custom"
                    className="text-sm sm:text-base font-semibold text-foreground cursor-pointer"
                  >
                    Outro presente
                  </Label>
                  <Badge variant="success" className="shrink-0 text-xs">
                    Personalizado
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Digite o presente que você gostaria de doar
                </p>
                {isCustomSelected && (
                  <div className="mt-2 w-full">
                    <Input
                      placeholder="Digite o nome do presente"
                      value={customGift}
                      onChange={(e) => setCustomGift(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      className="w-full text-sm sm:text-base"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50 text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Confirmar presença</span>
            <span className="sm:hidden">Confirmar</span>
            <Heart className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onConfirm([])}
          className="w-full text-xs sm:text-sm text-muted-foreground hover:text-foreground"
        >
          Confirmar sem escolher presente
        </Button>
      </div>
    </div>
  );
}

