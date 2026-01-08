"use client";

import { GuestsHeader } from "@/components/dashboard/GuestsHeader";
import { GuestsSummary } from "@/components/dashboard/GuestsSummary";
import { GuestsTable } from "@/components/dashboard/GuestsTable";
import { GuestDetailsModal } from "@/components/dashboard/GuestDetailsModal";
import { InviteModal } from "@/components/dashboard/InviteModal";
import { WelcomeScreen } from "@/components/dashboard/WelcomeScreen";
import { EventContext } from "@/contexts/EventContext";
import { useContext, useState, useEffect, useMemo } from "react";
import { getGuestById, getGuests } from "@/actions/guest";
import type { GuestDetails, GuestListItem } from "@/actions/guest";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileDown } from "lucide-react";
import { generateGuestsListPDF } from "@/lib/generate-pdf";

export default function GuestsPage() {
  const eventContext = useContext(EventContext);
  const [guests, setGuests] = useState<GuestListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestDetails | null>(null);
  const [isLoadingGuest, setIsLoadingGuest] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { showToast } = useToast();

  // Obter o evento atual (pode ser null)
  const currentEvent = eventContext?.currentEvent;

  // Carregar convidados do banco
  const loadGuests = async () => {
    if (!currentEvent?.id) {
      setGuests([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const guestsData = await getGuests(currentEvent.id);
      setGuests(guestsData);
    } catch (error) {
      console.error("Erro ao carregar convidados:", error);
      showToast("Erro ao carregar convidados. Tente novamente.", "error");
      setGuests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar convidados quando o componente montar ou quando o evento mudar
  useEffect(() => {
    loadGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvent?.id]);

  // Filtrar convidados baseado na busca (deve estar antes de qualquer early return)
  const filteredGuests = useMemo(() => {
    if (!searchQuery.trim()) {
      return guests.map((guest) => ({ guest, matchType: null as "guest" | "companion" | null }));
    }

    const query = searchQuery.toLowerCase().trim();
    const results: Array<{ guest: GuestListItem; matchType: "guest" | "companion" | null }> = [];

    guests.forEach((guest) => {
      // Verificar se o nome do convidado corresponde
      if (guest.name.toLowerCase().includes(query)) {
        results.push({ guest, matchType: "guest" });
        return;
      }

      // Verificar se algum acompanhante corresponde
      const matchingCompanion = guest.companions.find((companion) =>
        companion.toLowerCase().includes(query)
      );
      if (matchingCompanion) {
        results.push({ guest, matchType: "companion" });
      }
    });

    return results;
  }, [guests, searchQuery]);

  // Se não há eventos ou não há evento selecionado, mostrar tela de boas-vindas
  if (!eventContext || eventContext.events.length === 0 || !currentEvent) {
    return <WelcomeScreen />;
  }

  const totalGuests = guests.length;
  const totalPeople = guests.reduce(
    (sum, guest) => sum + 1 + guest.companionsTotal,
    0
  );
  // Como não temos status de confirmação no banco ainda, vamos considerar todos como confirmados
  const confirmedCount = totalGuests;

  const handleViewGuest = async (guestId: string) => {
    try {
      setIsLoadingGuest(true);
      setIsDetailsModalOpen(true);
      const guestDetails = await getGuestById(guestId);
      
      if (guestDetails) {
        setSelectedGuest(guestDetails);
      } else {
        showToast("Erro ao carregar informações do convidado.", "error");
        setIsDetailsModalOpen(false);
      }
    } catch (error) {
      showToast("Erro ao carregar informações do convidado. Tente novamente.", "error");
      console.error("Erro ao carregar convidado:", error);
      setIsDetailsModalOpen(false);
    } finally {
      setIsLoadingGuest(false);
    }
  };

  const handleDetailsModalClose = (open: boolean) => {
    setIsDetailsModalOpen(open);
    if (!open) {
      setSelectedGuest(null);
    }
  };

  const handleCopyGuestInfo = async (guestId: string) => {
    try {
      const guestDetails = await getGuestById(guestId);
      
      if (!guestDetails) {
        showToast("Erro ao carregar informações do convidado.", "error");
        return;
      }

      let text = `🎉 Confirmação de Presença\n\n`;
      text += `Evento: ${currentEvent.eventName}\n`;
      text += `Organizado por: ${currentEvent.parentsName}\n`;
      text += `Convidado: ${guestDetails.name}\n`;
      
      if (guestDetails.companions.length > 0) {
        text += `Acompanhantes: ${guestDetails.companions.map(c => c.name).join(", ")}\n`;
      }
      
      text += `\n📅 Data: ${currentEvent.date} às ${currentEvent.time}\n`;
      text += `📍 Local: ${currentEvent.location}\n\n`;

      // Adicionar presentes da lista
      const allGifts: Array<{ title: string; description?: string; isCustom?: boolean }> = [];
      
      guestDetails.giftSelections.forEach((selection) => {
        allGifts.push({
          title: selection.gift.title,
          description: selection.gift.description,
          isCustom: false,
        });
      });

      // Adicionar presentes customizados
      guestDetails.customGifts.forEach((customGift) => {
        allGifts.push({
          title: customGift.title,
          description: customGift.description || undefined,
          isCustom: true,
        });
      });

      if (allGifts.length > 0) {
        text += `🎁 Presentes Escolhidos:\n`;
        allGifts.forEach((gift, index) => {
          text += `${index + 1}. ${gift.title}`;
          if (gift.description) {
            text += ` - ${gift.description}`;
          }
          if (gift.isCustom) {
            text += ` (Personalizado)`;
          }
          text += `\n`;
        });
      }

      await navigator.clipboard.writeText(text);
      showToast("Informações copiadas para a área de transferência!", "success");
    } catch (error) {
      showToast("Erro ao copiar informações.", "error");
      console.error("Erro ao copiar:", error);
    }
  };

  const handleGenerateGuestsListPDF = async () => {
    if (!currentEvent) {
      showToast("Nenhum chá selecionado", "error");
      return;
    }

    if (guests.length === 0) {
      showToast("Não há convidados para gerar a lista.", "error");
      return;
    }

    try {
      setIsGeneratingPDF(true);
      await generateGuestsListPDF(
        currentEvent.eventName,
        currentEvent.parentsName,
        guests
      );
      showToast("PDF gerado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao gerar PDF. Verifique se a biblioteca jsPDF está instalada.";
      showToast(errorMessage, "error");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando convidados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GuestsHeader
        eventName={currentEvent.eventName}
        onViewInvite={() => setIsInviteModalOpen(true)}
      />

      {/* Filtro de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nome do convidado ou acompanhante..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <GuestsSummary
        totalPeople={totalPeople}
      />

      {/* Botão para gerar PDF */}
      <div className="flex justify-end">
        <Button
          onClick={handleGenerateGuestsListPDF}
          disabled={isGeneratingPDF || guests.length === 0}
          className="bg-orange-600 hover:bg-orange-700 text-white"
          title="Gerar PDF com lista de convidados e acompanhantes em ordem alfabética"
        >
          <FileDown className="mr-2 h-4 w-4" />
          {isGeneratingPDF ? "Gerando PDF..." : "Gerar Lista em PDF"}
        </Button>
      </div>

      <GuestsTable
        guests={filteredGuests.map((item) => item.guest)}
        matchTypes={filteredGuests.map((item) => item.matchType)}
        onView={handleViewGuest}
        onCopy={handleCopyGuestInfo}
      />

      {isDetailsModalOpen && (
        <GuestDetailsModal
          open={isDetailsModalOpen}
          onOpenChange={handleDetailsModalClose}
          guest={selectedGuest}
          isLoading={isLoadingGuest}
        />
      )}

      <InviteModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
      />
    </div>
  );
}

