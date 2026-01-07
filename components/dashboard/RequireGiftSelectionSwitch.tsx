"use client";

import { useState, useContext } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EventContext } from "@/contexts/EventContext";
import { updateTea } from "@/actions/tea";
import { useToast } from "@/components/ui/toast";

export function RequireGiftSelectionSwitch() {
  const eventContext = useContext(EventContext);
  const currentEvent = eventContext?.currentEvent;
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!currentEvent) {
    return null;
  }

  const handleToggle = async (checked: boolean) => {
    if (!currentEvent.id) return;

    try {
      setIsLoading(true);
      await updateTea(currentEvent.id, { requireGiftSelection: checked });
      await eventContext?.refreshEvents();
      showToast(
        checked 
          ? "Seleção de presente obrigatória ativada!" 
          : "Convidados podem confirmar sem escolher presente.",
        "success"
      );
    } catch (error) {
      console.error("Erro ao atualizar configuração de presente:", error);
      showToast("Erro ao atualizar configuração. Tente novamente.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleção de Presente</CardTitle>
        <CardDescription>
          Controle se os convidados devem obrigatoriamente escolher um presente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="require-gift-selection" className="text-base">
              Obrigar Seleção de Presente
            </Label>
            <p className="text-sm text-muted-foreground">
              {currentEvent.requireGiftSelection
                ? "Convidados devem escolher pelo menos um presente para confirmar presença"
                : "Convidados podem confirmar presença sem escolher presente"}
            </p>
          </div>
          <Switch
            id="require-gift-selection"
            checked={currentEvent.requireGiftSelection}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}

