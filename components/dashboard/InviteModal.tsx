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
  const [companions, setCompanions] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [gifts, setGifts] = useState<Gift[]>([]);
  // Estado para preservar dados do step 2
  const [step2Data, setStep2Data] = useState<{
    fullName: string;
    companions: string[];
  }>({
    fullName: "",
    companions: [],
  });
  // Estado para preservar dados do step 3
  const [step3Data, setStep3Data] = useState<{
    selectedGiftIds: string[];
    customGift: string;
    isCustomSelected: boolean;
  }>({
    selectedGiftIds: [],
    customGift: "",
    isCustomSelected: false,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingGifts, setIsLoadingGifts] = useState(false);

  const handleNext = (name?: string, companionsList?: string[]) => {
    if (name) {
      setGuestName(name);
    }
    if (companionsList) {
      setCompanions(companionsList);
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStep2DataChange = (data: { fullName: string; companions: string[] }) => {
    // Só atualiza se os dados forem diferentes para evitar loops
    if (
      step2Data.fullName !== data.fullName ||
      JSON.stringify(step2Data.companions.sort()) !== JSON.stringify(data.companions.sort())
    ) {
      setStep2Data(data);
      setGuestName(data.fullName);
      setCompanions(data.companions);
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
    // Atualizar estado do step 3 antes de confirmar
    const selectedGiftIds: string[] = [];
    let customGift = "";
    let isCustomSelected = false;

    selectedGifts.forEach((gift) => {
      if (gift.id) {
        selectedGiftIds.push(gift.id);
      } else if (gift.customGift) {
        customGift = gift.customGift;
        isCustomSelected = true;
      }
    });

    setStep3Data({
      selectedGiftIds,
      customGift,
      isCustomSelected,
    });

    // Aqui você salvaria a confirmação de presença e a escolha dos presentes
    console.log("Confirmação:", {
      guestName,
      companions,
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
      setCompanions([]);
      setShowConfirmation(false);
      setGifts([]);
      setStep2Data({
        fullName: "",
        companions: [],
      });
      setStep3Data({
        selectedGiftIds: [],
        customGift: "",
        isCustomSelected: false,
      });
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
                {currentStep === 2 && (
                  <InviteStep2
                    onNext={handleNext}
                    onBack={handleBack}
                    initialData={step2Data}
                    onDataChange={handleStep2DataChange}
                  />
                )}
                {currentStep === 3 && (
                  <InviteStep3
                    gifts={gifts}
                    onBack={handleBack}
                    onConfirm={handleConfirmPresence}
                    requireGiftSelection={currentEvent?.requireGiftSelection}
                    initialData={step3Data}
                    onDataChange={setStep3Data}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

