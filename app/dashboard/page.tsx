"use client";

import { useState, useContext, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { EventInfo } from "@/components/dashboard/EventInfo";
import { InviteModal } from "@/components/dashboard/InviteModal";
import { WelcomeScreen } from "@/components/dashboard/WelcomeScreen";
import { Users, Gift } from "lucide-react";
import { EventContext } from "@/contexts/EventContext";
import { getGuests } from "@/actions/guest";
import { getGifts } from "@/actions/gift";
import type { GuestListItem } from "@/actions/guest";
import type { Gift as GiftType } from "@/actions/gift";

export default function DashboardPage() {
  const eventContext = useContext(EventContext);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [guests, setGuests] = useState<GuestListItem[]>([]);
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentEvent = eventContext?.currentEvent;

  // Carregar dados do banco
  useEffect(() => {
    const loadData = async () => {
      if (!currentEvent?.id) {
        setGuests([]);
        setGifts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [guestsData, giftsData] = await Promise.all([
          getGuests(currentEvent.id),
          getGifts(currentEvent.id),
        ]);
        setGuests(guestsData);
        setGifts(giftsData);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        setGuests([]);
        setGifts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentEvent?.id]);

  // Se não há eventos ou não há evento selecionado, mostrar tela de boas-vindas
  if (!eventContext || eventContext.events.length === 0 || !currentEvent) {
    return <WelcomeScreen />;
  }

  const eventName = currentEvent.eventName;

  // Calcular métricas baseadas nos dados reais
  const totalGuests = guests.length;
  const totalCompanions = guests.reduce((sum, guest) => sum + guest.companionsTotal, 0);
  const confirmedGuests = totalCompanions; // Confirmados = total de acompanhantes
  const totalPeople = totalGuests + totalCompanions;
  const totalGifts = gifts.length;
  const chosenGifts = gifts.reduce((sum, gift) => sum + gift.chosen, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando dados do dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        eventName={eventName}
        onViewInvite={() => setIsInviteModalOpen(true)}
      />

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Users}
          value={totalGuests}
          label="Total de Convidados"
        />
        <MetricCard
          icon={Users}
          value={confirmedGuests}
          label="Confirmados"
          variant="orange"
        />
        <MetricCard
          icon={Gift}
          value={totalGifts}
          label="Total de Presentes"
        />
        <MetricCard
          icon={Gift}
          value={chosenGifts}
          label="Presentes Escolhidos"
          variant="orange"
        />
      </div>

      {/* Quick Actions and Event Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <EventInfo
          confirmedGuests={confirmedGuests}
          totalGuests={totalGuests}
          totalCompanions={totalCompanions}
          totalPeople={totalPeople}
        />
      </div>

      <InviteModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
      />
    </div>
  );
}

