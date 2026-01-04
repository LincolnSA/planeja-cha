"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Gift, Copy } from "lucide-react";

export function QuickActions() {
  const copyInviteLink = () => {
    const link = "http://localhost:8080/eve";
    navigator.clipboard.writeText(link);
    // Você pode adicionar um toast aqui para feedback
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
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar convidado
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
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

