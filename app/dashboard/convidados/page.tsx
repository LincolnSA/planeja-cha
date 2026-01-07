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
import { Search } from "lucide-react";

export default function GuestsPage() {
  const eventContext = useContext(EventContext);
  const [guests, setGuests] = useState<GuestListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestDetails | null>(null);
  const [isLoadingGuest, setIsLoadingGuest] = useState(false);
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

  // Se não há eventos ou não há evento selecionado, mostrar tela de boas-vindas
  if (!eventContext || eventContext.events.length === 0 || !currentEvent) {
    return <WelcomeScreen />;
  }

  // Filtrar convidados baseado na busca
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

      <GuestsTable
        guests={filteredGuests.map((item) => item.guest)}
        matchTypes={filteredGuests.map((item) => item.matchType)}
        onView={handleViewGuest}
      />

      <GuestDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={handleDetailsModalClose}
        guest={selectedGuest}
        isLoading={isLoadingGuest}
      />

      <InviteModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
      />
    </div>
  );
}

