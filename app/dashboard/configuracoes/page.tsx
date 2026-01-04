"use client";

import { useState, useContext } from "react";
import { SettingsHeader } from "@/components/dashboard/SettingsHeader";
import { EventInfoForm } from "@/components/dashboard/EventInfoForm";
import { GuestSettingsForm } from "@/components/dashboard/GuestSettingsForm";
import { InviteModal } from "@/components/dashboard/InviteModal";
import { WelcomeScreen } from "@/components/dashboard/WelcomeScreen";
import { EventContext } from "@/contexts/EventContext";

export default function SettingsPage() {
  const eventContext = useContext(EventContext);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Se não há eventos ou não há evento selecionado, mostrar tela de boas-vindas
  if (!eventContext || eventContext.events.length === 0 || !eventContext.currentEvent) {
    return <WelcomeScreen />;
  }

  const currentEvent = eventContext.currentEvent!;

  return (
    <div className="space-y-6">
      <SettingsHeader
        eventName={currentEvent.eventName}
        onViewInvite={() => setIsInviteModalOpen(true)}
      />

      <EventInfoForm />

      <GuestSettingsForm />

      <InviteModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
      />
    </div>
  );
}

