"use client";

import { useState, useContext } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EventContext } from "@/contexts/EventContext";
import { updateTea } from "@/actions/tea";
import { useToast } from "@/components/ui/toast";

export function TeaStatusSwitch() {
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
      await updateTea(currentEvent.id, { isActive: checked });
      await eventContext?.refreshEvents();
      showToast(
        checked 
          ? "Confirmações de convidados ativadas!" 
          : "Confirmações de convidados encerradas!",
        "success"
      );
    } catch (error) {
      console.error("Erro ao atualizar status do chá:", error);
      showToast("Erro ao atualizar status. Tente novamente.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Chá</CardTitle>
        <CardDescription>
          Controle se as confirmações de convidados estão abertas ou encerradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="tea-status" className="text-base">
              Confirmações Abertas
            </Label>
            <p className="text-sm text-muted-foreground">
              {currentEvent.isActive
                ? "Convidados podem confirmar presença e escolher presentes"
                : "Confirmações encerradas. Novos convidados não podem confirmar presença"}
            </p>
          </div>
          <Switch
            id="tea-status"
            checked={currentEvent.isActive}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}

