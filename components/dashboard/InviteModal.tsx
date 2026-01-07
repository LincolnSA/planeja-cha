"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InviteStep1 } from "@/components/invite/InviteStep1";
import { InviteStep2 } from "@/components/invite/InviteStep2";
import { InviteStep3 } from "@/components/invite/InviteStep3";
import { InviteConfirmation } from "@/components/invite/InviteConfirmation";
import { useEvent } from "@/contexts/EventContext";
import { getGifts } from "@/actions/gift";
import type { Gift } from "@/actions/gift";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteModal({
  open,
  onOpenChange,
}: InviteModalProps) {
  const { currentEvent } = useEvent();
  const [currentStep, setCurrentStep] = useState(1);
  const [guestName, setGuestName] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [gifts, setGifts] = useState<Gift[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingGifts, setIsLoadingGifts] = useState(false);

  const handleNext = (name?: string) => {
    if (name) {
      setGuestName(name);
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmPresence = (
    selectedGifts: Array<{ id: string | null; customGift?: string }>
  ) => {
    // Aqui você salvaria a confirmação de presença e a escolha dos presentes
    console.log("Confirmação:", {
      guestName,
      selectedGifts,
    });
    // Mostra a tela de confirmação
    setShowConfirmation(true);
  };

  // Carregar presentes quando o modal abrir
  useEffect(() => {
    const loadGifts = async () => {
      if (!open || !currentEvent?.id) {
        setGifts([]);
        return;
      }

      try {
        setIsLoadingGifts(true);
        const giftsData = await getGifts(currentEvent.id);
        setGifts(giftsData);
      } catch (error) {
        console.error("Erro ao carregar presentes:", error);
        setGifts([]);
      } finally {
        setIsLoadingGifts(false);
      }
    };

    loadGifts();
  }, [open, currentEvent?.id]);

  const handleClose = (open: boolean) => {
    if (!open) {
      setCurrentStep(1);
      setGuestName("");
      setShowConfirmation(false);
      setGifts([]);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 w-[95vw] sm:w-full">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 shrink-0">
          <DialogTitle className="text-lg sm:text-xl">Visualizar Convite</DialogTitle>
          <DialogDescription className="text-sm">
            Visualize como o convidado verá o convite e confirme a presença
          </DialogDescription>
        </DialogHeader>

        <div className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 overflow-y-auto flex-1 min-h-0">
          <div className="rounded-lg bg-background">
            {showConfirmation ? (
              <InviteConfirmation guestName={guestName} />
            ) : (
              <>
                {currentStep === 1 && <InviteStep1 onNext={handleNext} currentStep={currentStep} />}
                {currentStep === 2 && <InviteStep2 onNext={handleNext} onBack={handleBack} />}
                {currentStep === 3 && <InviteStep3 gifts={gifts} onBack={handleBack} onConfirm={handleConfirmPresence} />}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

