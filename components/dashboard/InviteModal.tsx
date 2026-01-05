"use client";

import { useState } from "react";
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
import type { Gift } from "@/actions/gift";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gifts?: Gift[];
}

export function InviteModal({
  open,
  onOpenChange,
  gifts = [],
}: InviteModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [guestName, setGuestName] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handleClose = (open: boolean) => {
    if (!open) {
      setCurrentStep(1);
      setGuestName("");
      setShowConfirmation(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Visualizar Convite</DialogTitle>
          <DialogDescription>
            Visualize como o convidado verá o convite e confirme a presença
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
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

