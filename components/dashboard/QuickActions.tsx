"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Copy, FileDown } from "lucide-react";
import { EventContext } from "@/contexts/EventContext";
import { useToast } from "@/components/ui/toast";
import { getTeaCompleteData } from "@/actions/tea/get-tea-complete-data";
import { generateTeaPDF } from "@/lib/generate-pdf";

export function QuickActions() {
  const eventContext = useContext(EventContext);
  const currentEvent = eventContext?.currentEvent || null;
  const { showToast } = useToast();
  const router = useRouter();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const handleGeneratePDF = async () => {
    if (!currentEvent?.id) {
      showToast("Nenhum chá selecionado", "error");
      return;
    }

    try {
      setIsGeneratingPDF(true);
      const teaData = await getTeaCompleteData(currentEvent.id);
      
      if (!teaData) {
        showToast("Erro ao carregar dados do chá", "error");
        return;
      }

      await generateTeaPDF(teaData);
      showToast("PDF gerado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      showToast("Erro ao gerar PDF. Verifique se a biblioteca jsPDF está instalada.", "error");
    } finally {
      setIsGeneratingPDF(false);
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
            className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
            onClick={handleAddGift}
          >
            <Gift className="mr-2 h-4 w-4" />
            Adicionar presente
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
            onClick={copyInviteLink}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiar link do convite
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
          >
            <FileDown className="mr-2 h-4 w-4" />
            {isGeneratingPDF ? "Gerando PDF..." : "Salvar PDF"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

