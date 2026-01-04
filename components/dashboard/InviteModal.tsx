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

interface Gift {
  id: string;
  title: string;
  description: string;
  quantity: number;
  chosen: number;
}

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gifts?: Gift[];
}

// Mock de presentes - você pode substituir por dados reais depois
const defaultGifts: Gift[] = [
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

export function InviteModal({
  open,
  onOpenChange,
  gifts = defaultGifts,
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
    selectedGiftId: string | null,
    customGift?: string
  ) => {
    // Aqui você salvaria a confirmação de presença e a escolha do presente
    console.log("Confirmação:", {
      guestName,
      giftId: selectedGiftId,
      customGift,
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

