"use client";

import { GiftsHeader } from "@/components/dashboard/GiftsHeader";
import { GiftsSummary } from "@/components/dashboard/GiftsSummary";
import { GiftsGrid } from "@/components/dashboard/GiftsGrid";
import { AddGiftModal } from "@/components/dashboard/AddGiftModal";
import { DeleteGiftModal } from "@/components/dashboard/DeleteGiftModal";
import { InviteModal } from "@/components/dashboard/InviteModal";
import { WelcomeScreen } from "@/components/dashboard/WelcomeScreen";
import { EventContext } from "@/contexts/EventContext";
import { useContext, useState, useEffect } from "react";
import { getGifts, createGift, updateGift, deleteGift } from "@/actions/gift";
import type { Gift } from "@/actions/gift";
import { useToast } from "@/components/ui/toast";

export default function GiftsPage() {
  const eventContext = useContext(EventContext);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [giftToEdit, setGiftToEdit] = useState<Gift | null>(null);
  const [giftToDelete, setGiftToDelete] = useState<Gift | null>(null);
  const { showToast } = useToast();

  const currentEvent = eventContext?.currentEvent;
  const eventName = currentEvent?.eventName || "";

  // Carregar presentes do banco
  const loadGifts = async () => {
    if (!currentEvent?.id) return;
    
    try {
      setIsLoading(true);
      const giftsData = await getGifts(currentEvent.id);
      setGifts(giftsData);
    } catch (error) {
      console.error("Erro ao carregar presentes:", error);
      showToast("Erro ao carregar presentes. Tente novamente.", "error");
      setGifts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar presentes quando o componente montar ou quando o evento mudar
  useEffect(() => {
    if (currentEvent?.id) {
      loadGifts();
    } else {
      setGifts([]);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvent?.id]);

  const totalGifts = gifts.length;
  const chosenGifts = gifts.reduce((sum, gift) => sum + gift.chosen, 0);

  const handleAddGift = () => {
    setGiftToEdit(null);
    setIsModalOpen(true);
  };

  const handleAddGiftSubmit = async (
    title: string,
    description: string,
    quantity: number
  ) => {
    if (!currentEvent?.id) return;

    try {
      const result = await createGift({
        title,
        description,
        quantity,
        teaId: currentEvent.id!,
      });

      if (result.success) {
        showToast("Presente adicionado com sucesso!", "success");
        await loadGifts();
      } else {
        showToast(result.error.message || "Erro ao adicionar presente.", "error");
      }
    } catch (error) {
      showToast("Erro ao adicionar presente. Tente novamente.", "error");
      console.error("Erro ao adicionar presente:", error);
    }
  };

  const handleEditGiftSubmit = async (
    giftId: string,
    title: string,
    description: string,
    quantity: number
  ) => {
    try {
      const updated = await updateGift(giftId, {
        title,
        description,
        quantity,
      });

      if (updated) {
        showToast("Presente atualizado com sucesso!", "success");
        await loadGifts();
      } else {
        showToast("Erro ao atualizar presente. Tente novamente.", "error");
      }
    } catch (error) {
      showToast("Erro ao atualizar presente. Tente novamente.", "error");
      console.error("Erro ao atualizar presente:", error);
    }
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

  const handleConfirmDelete = async () => {
    if (!giftToDelete) return;

    // Verificar se o presente já foi escolhido antes de tentar deletar
    if (giftToDelete.chosen > 0) {
      showToast("Não é possível deletar um presente que já foi escolhido por convidados.", "error");
      setGiftToDelete(null);
      return;
    }

    try {
      const success = await deleteGift(giftToDelete.id);
      
      if (success) {
        showToast("Presente deletado com sucesso!", "success");
        setGiftToDelete(null);
        await loadGifts();
      } else {
        showToast("Erro ao deletar presente. Tente novamente.", "error");
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao deletar presente. Tente novamente.";
      showToast(errorMessage, "error");
      console.error("Erro ao deletar presente:", error);
    }
  };

  const handleDeleteModalClose = (open: boolean) => {
    setIsDeleteModalOpen(open);
    if (!open) {
      setGiftToDelete(null);
    }
  };

  // Se não há eventos ou não há evento selecionado, mostrar tela de boas-vindas
  if (!eventContext || eventContext.events.length === 0 || !currentEvent) {
    return <WelcomeScreen />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando presentes...</p>
      </div>
    );
  }

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
        giftChosen={giftToDelete?.chosen}
        onConfirm={handleConfirmDelete}
      />

      <InviteModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
      />
    </div>
  );
}

