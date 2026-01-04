"use client";

import { GuestsHeader } from "@/components/dashboard/GuestsHeader";
import { GuestsSummary } from "@/components/dashboard/GuestsSummary";
import { GuestsTable } from "@/components/dashboard/GuestsTable";
import { AddGuestModal } from "@/components/dashboard/AddGuestModal";
import { DeleteGuestModal } from "@/components/dashboard/DeleteGuestModal";
import { InviteModal } from "@/components/dashboard/InviteModal";
import { WelcomeScreen } from "@/components/dashboard/WelcomeScreen";
import { EventContext } from "@/contexts/EventContext";
import { useContext, useState } from "react";

// Dados mockados - você pode substituir por dados reais depois
const initialGuests = [
  {
    id: "1",
    name: "Maria Silva",
    companionsConfirmed: 1,
    companionsTotal: 2,
    companions: [
      { id: "c1-1", name: "João Silva" },
      { id: "c1-2", name: "" },
    ],
    status: "confirmed" as const,
  },
  {
    id: "2",
    name: "João Santos",
    companionsConfirmed: 2,
    companionsTotal: 3,
    companions: [
      { id: "c2-1", name: "Maria Santos" },
      { id: "c2-2", name: "Pedro Santos" },
      { id: "c2-3", name: "" },
    ],
    status: "confirmed" as const,
  },
  {
    id: "3",
    name: "Ana Oliveira",
    companionsConfirmed: 0,
    companionsTotal: 1,
    companions: [{ id: "c3-1", name: "" }],
    status: "pending" as const,
  },
  {
    id: "4",
    name: "Pedro Costa",
    companionsConfirmed: 0,
    companionsTotal: 2,
    companions: [
      { id: "c4-1", name: "" },
      { id: "c4-2", name: "" },
    ],
    status: "confirmed" as const,
  },
  {
    id: "5",
    name: "Carla Lima",
    companionsConfirmed: 0,
    companionsTotal: 4,
    companions: [
      { id: "c5-1", name: "" },
      { id: "c5-2", name: "" },
      { id: "c5-3", name: "" },
      { id: "c5-4", name: "" },
    ],
    status: "pending" as const,
  },
];

export default function GuestsPage() {
  const eventContext = useContext(EventContext);
  
  // Se não há eventos ou não há evento selecionado, mostrar tela de boas-vindas
  if (!eventContext || eventContext.events.length === 0 || !eventContext.currentEvent) {
    return <WelcomeScreen />;
  }

  const currentEvent = eventContext.currentEvent!;
  const [guests, setGuests] = useState(initialGuests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [guestToEdit, setGuestToEdit] = useState<typeof initialGuests[0] | null>(null);
  const [guestToDelete, setGuestToDelete] = useState<typeof initialGuests[0] | null>(null);
  const eventName = currentEvent.eventName;

  const confirmedCount = guests.filter((g) => g.status === "confirmed").length;
  const totalGuests = guests.length;
  const totalPeople =
    guests.reduce(
      (sum, guest) => sum + 1 + guest.companionsConfirmed,
      0
    );

  const handleAddGuest = () => {
    setGuestToEdit(null);
    setIsModalOpen(true);
  };

  const handleAddGuestSubmit = (
    guestName: string,
    companions: { id: string; name: string }[]
  ) => {
    const newGuest = {
      id: Date.now().toString(),
      name: guestName,
      companionsConfirmed: 0,
      companionsTotal: companions.length,
      companions: companions.map((c, index) => ({
        id: `c-${Date.now()}-${index}`,
        name: c.name,
      })),
      status: "pending" as const,
    };
    setGuests([...guests, newGuest]);
  };

  const handleEditGuestSubmit = (
    guestId: string,
    guestName: string,
    companions: { id: string; name: string }[]
  ) => {
    setGuests(
      guests.map((guest) => {
        if (guest.id === guestId) {
          const newCompanionsTotal = companions.length;
          // Se o número de acompanhantes totais diminuiu, ajustar os confirmados
          const newCompanionsConfirmed = Math.min(
            guest.companionsConfirmed,
            newCompanionsTotal
          );
          
          return {
            ...guest,
            name: guestName,
            companionsTotal: newCompanionsTotal,
            companionsConfirmed: newCompanionsConfirmed,
            companions: companions.map((c, index) => ({
              id: c.id || `c-${guestId}-${index}`,
              name: c.name,
            })),
          };
        }
        return guest;
      })
    );
  };

  const handleEdit = (guest: typeof initialGuests[0]) => {
    setGuestToEdit(guest);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setGuestToEdit(null);
    }
  };

  const handleDelete = (guest: typeof initialGuests[0]) => {
    setGuestToDelete(guest);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (guestToDelete) {
      setGuests(guests.filter((g) => g.id !== guestToDelete.id));
      setGuestToDelete(null);
    }
  };

  const handleDeleteModalClose = (open: boolean) => {
    setIsDeleteModalOpen(open);
    if (!open) {
      setGuestToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <GuestsHeader
        eventName={eventName}
        onViewInvite={() => setIsInviteModalOpen(true)}
      />

      <GuestsSummary
        confirmed={confirmedCount}
        total={totalGuests}
        totalPeople={totalPeople}
        onAddGuest={handleAddGuest}
      />

      <GuestsTable
        guests={guests}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddGuestModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onAdd={handleAddGuestSubmit}
        onEdit={handleEditGuestSubmit}
        guestToEdit={guestToEdit}
      />

      <DeleteGuestModal
        open={isDeleteModalOpen}
        onOpenChange={handleDeleteModalClose}
        guestName={guestToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
      />

      <InviteModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
      />
    </div>
  );
}

