"use client";

import { GiftsHeader } from "@/components/dashboard/GiftsHeader";
import { GiftsSummary } from "@/components/dashboard/GiftsSummary";
import { GiftsGrid } from "@/components/dashboard/GiftsGrid";
import { AddGiftModal } from "@/components/dashboard/AddGiftModal";
import { DeleteGiftModal } from "@/components/dashboard/DeleteGiftModal";
import { InviteModal } from "@/components/dashboard/InviteModal";
import { WelcomeScreen } from "@/components/dashboard/WelcomeScreen";
import { EventContext } from "@/contexts/EventContext";
import { useContext, useState } from "react";

interface Gift {
  id: string;
  title: string;
  description: string;
  quantity: number;
  chosen: number;
}

// Dados mockados - você pode substituir por dados reais depois
const initialGifts: Gift[] = [
  {
    id: "1",
    title: "Kit Banho Bebê",
    description: "Toalha, sabonete e shampoo",
    quantity: 3,
    chosen: 1,
  },
  {
    id: "2",
    title: "Fralda Descartável P",
    description: "Pacote com 40 unidades",
    quantity: 5,
    chosen: 3,
  },
  {
    id: "3",
    title: "Mamadeira Anticólica",
    description: "Kit com 3 mamadeiras",
    quantity: 2,
    chosen: 2,
  },
  {
    id: "4",
    title: "Body Manga Longa",
    description: "Kit 3 peças - Tam P",
    quantity: 4,
    chosen: 1,
  },
];

export default function GiftsPage() {
  const eventContext = useContext(EventContext);
  
  // Se não há eventos ou não há evento selecionado, mostrar tela de boas-vindas
  if (!eventContext || eventContext.events.length === 0 || !eventContext.currentEvent) {
    return <WelcomeScreen />;
  }

  const currentEvent = eventContext.currentEvent!;
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [giftToEdit, setGiftToEdit] = useState<Gift | null>(null);
  const [giftToDelete, setGiftToDelete] = useState<Gift | null>(null);
  const eventName = currentEvent.eventName;

  const totalGifts = gifts.length;
  const chosenGifts = gifts.reduce((sum, gift) => sum + gift.chosen, 0);

  const handleAddGift = () => {
    setGiftToEdit(null);
    setIsModalOpen(true);
  };

  const handleAddGiftSubmit = (
    title: string,
    description: string,
    quantity: number
  ) => {
    const newGift: Gift = {
      id: Date.now().toString(),
      title,
      description,
      quantity,
      chosen: 0,
    };
    setGifts([...gifts, newGift]);
  };

  const handleEditGiftSubmit = (
    giftId: string,
    title: string,
    description: string,
    quantity: number
  ) => {
    setGifts(
      gifts.map((gift) => {
        if (gift.id === giftId) {
          // Se a quantidade diminuir, ajustar os escolhidos
          const newChosen = Math.min(gift.chosen, quantity);
          return {
            ...gift,
            title,
            description,
            quantity,
            chosen: newChosen,
          };
        }
        return gift;
      })
    );
  };

  const handleEdit = (gift: Gift) => {
    setGiftToEdit(gift);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setGiftToEdit(null);
    }
  };

  const handleDelete = (gift: Gift) => {
    setGiftToDelete(gift);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (giftToDelete) {
      setGifts(gifts.filter((g) => g.id !== giftToDelete.id));
      setGiftToDelete(null);
    }
  };

  const handleDeleteModalClose = (open: boolean) => {
    setIsDeleteModalOpen(open);
    if (!open) {
      setGiftToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <GiftsHeader
        eventName={eventName}
        onViewInvite={() => setIsInviteModalOpen(true)}
      />

      <GiftsSummary
        chosen={chosenGifts}
        total={totalGifts}
        onAddGift={handleAddGift}
      />

      <GiftsGrid
        gifts={gifts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddGiftModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onAdd={handleAddGiftSubmit}
        onEdit={handleEditGiftSubmit}
        giftToEdit={giftToEdit}
      />

      <DeleteGiftModal
        open={isDeleteModalOpen}
        onOpenChange={handleDeleteModalClose}
        giftTitle={giftToDelete?.title || ""}
        onConfirm={handleConfirmDelete}
      />

      <InviteModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        gifts={gifts}
      />
    </div>
  );
}

