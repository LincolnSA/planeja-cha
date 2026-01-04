"use client";

import { useState, useContext } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { EventInfo } from "@/components/dashboard/EventInfo";
import { InviteModal } from "@/components/dashboard/InviteModal";
import { WelcomeScreen } from "@/components/dashboard/WelcomeScreen";
import { Users, CheckCircle2, Gift } from "lucide-react";
import { EventContext } from "@/contexts/EventContext";

export default function DashboardPage() {
  const eventContext = useContext(EventContext);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Se não há eventos ou não há evento selecionado, mostrar tela de boas-vindas
  if (!eventContext || eventContext.events.length === 0 || !eventContext.currentEvent) {
    return <WelcomeScreen />;
  }

  const currentEvent = eventContext.currentEvent;
  const eventName = currentEvent.eventName;
  const totalGuests = 5;
  const confirmedGuests = 3;
  const totalCompanions = 4; // Total de acompanhantes confirmados
  const totalPeople = confirmedGuests + totalCompanions; // Total de pessoas (convidados + acompanhantes)
  const totalGifts = 24;
  const chosenGifts = 18;

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
          icon={CheckCircle2}
          value={confirmedGuests}
          label="Confirmados"
          variant="green"
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
          variant="green"
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

