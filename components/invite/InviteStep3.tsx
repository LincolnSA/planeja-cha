"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Gift {
  id: string;
  title: string;
  description: string;
  quantity: number;
  chosen: number;
}

interface InviteStep3Props {
  gifts: Gift[];
  onBack: () => void;
  onConfirm: (selectedGiftId: string | null, customGift?: string) => void;
}

export function InviteStep3({
  gifts,
  onBack,
  onConfirm,
}: InviteStep3Props) {
  const [selectedGift, setSelectedGift] = useState<string>("");
  const [customGift, setCustomGift] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const getGiftStatus = (gift: Gift) => {
    const remaining = gift.quantity - gift.chosen;
    if (remaining === 0) return { label: "Esgotado", variant: "destructive" as const };
    if (remaining <= 2) return { label: "Últimas unidades", variant: "warning" as const };
    return { label: "Disponível", variant: "success" as const };
  };

  const handleGiftSelect = (value: string) => {
    setSelectedGift(value);
    if (value === "custom") {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomGift("");
    }
  };

  const handleConfirm = () => {
    if (selectedGift === "custom") {
      onConfirm(null, customGift);
    } else if (selectedGift) {
      onConfirm(selectedGift);
    } else {
      onConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <RadioGroup value={selectedGift} onValueChange={handleGiftSelect}>
            <div className="space-y-4">
              {gifts.map((gift) => {
                const status = getGiftStatus(gift);
                const remaining = gift.quantity - gift.chosen;
                const isAvailable = remaining > 0;

                return (
                  <div
                    key={gift.id}
                    onClick={() => isAvailable && handleGiftSelect(gift.id)}
                    className={cn(
                      "flex items-start gap-4 rounded-lg border p-4 transition-colors cursor-pointer",
                      selectedGift === gift.id
                        ? "border-green-600 bg-green-50"
                        : "border-border hover:border-green-300",
                      !isAvailable && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <RadioGroupItem
                      value={gift.id}
                      id={gift.id}
                      disabled={!isAvailable}
                      className="mt-1"
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
                onClick={() => handleGiftSelect("custom")}
                className={cn(
                  "flex items-start gap-4 rounded-lg border p-4 transition-colors cursor-pointer hover:border-green-300",
                  selectedGift === "custom"
                    ? "border-green-600 bg-green-50"
                    : "border-border"
                )}
              >
                <RadioGroupItem value="custom" id="custom" className="mt-1" />
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
                  {showCustomInput && (
                    <Input
                      placeholder="Digite o nome do presente"
                      value={customGift}
                      onChange={(e) => setCustomGift(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </div>
          </RadioGroup>
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
          onClick={() => onConfirm(null)}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          Confirmar sem escolher presente
        </Button>
      </div>
    </div>
  );
}

