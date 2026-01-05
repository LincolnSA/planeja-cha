"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Gift, Copy } from "lucide-react";
import { EventContext } from "@/contexts/EventContext";
import { useToast } from "@/components/ui/toast";

export function QuickActions() {
  const eventContext = useContext(EventContext);
  const currentEvent = eventContext?.currentEvent || null;
  const { showToast } = useToast();
  const router = useRouter();

  const copyInviteLink = () => {
    if (currentEvent) {
      navigator.clipboard.writeText(currentEvent.inviteLink);
      showToast("Link do convite copiado!", "success");
    } else {
      showToast("Nenhum chá selecionado", "error");
    }
  };

  const handleAddGift = () => {
    if (currentEvent) {
      router.push("/dashboard/presentes");
    } else {
      showToast("Nenhum chá selecionado", "error");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
            onClick={handleAddGift}
          >
            <Gift className="mr-2 h-4 w-4" />
            Adicionar presente
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
            onClick={copyInviteLink}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiar link do convite
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

