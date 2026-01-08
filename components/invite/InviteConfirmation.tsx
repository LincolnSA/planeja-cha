"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface SelectedGiftInfo {
  id: string | null;
  title: string;
  description?: string;
  isCustom?: boolean;
}

interface InviteConfirmationProps {
  guestName: string;
  selectedGifts?: SelectedGiftInfo[];
  companions?: string[];
  eventName?: string;
  parentsName?: string;
  date?: string;
  time?: string;
  location?: string;
}

export function InviteConfirmation({ 
  guestName, 
  selectedGifts = [],
  companions = [],
  eventName = "",
  parentsName = "",
  date = "",
  time = "",
  location = "",
}: InviteConfirmationProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const confirmationRef = useRef<HTMLDivElement>(null);

  // Usar props fornecidas
  const eventDate = date;
  const eventTime = time;
  const eventLocation = location;
  const eventTitle = eventName;
  const eventParents = parentsName;

  const copyToClipboard = async () => {
    try {
      let text = `🎉 Confirmação de Presença\n\n`;
      text += `Evento: ${eventTitle}\n`;
      text += `Organizado por: ${eventParents}\n`;
      text += `Convidado: ${guestName}\n`;
      
      if (companions.length > 0) {
        text += `Acompanhantes: ${companions.join(", ")}\n`;
      }
      
      text += `\n📅 Data: ${eventDate} às ${eventTime}\n`;
      text += `📍 Local: ${eventLocation}\n\n`;

      if (selectedGifts.length > 0) {
        text += `🎁 Presentes Escolhidos:\n`;
        selectedGifts.forEach((gift, index) => {
          text += `${index + 1}. ${gift.title}`;
          if (gift.description) {
            text += ` - ${gift.description}`;
          }
          if (gift.isCustom) {
            text += ` (Personalizado)`;
          }
          text += `\n`;
        });
      }

      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast("Informações copiadas para a área de transferência!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast("Erro ao copiar informações.", "error");
      console.error("Erro ao copiar:", error);
    }
  };


  return (
    <div ref={confirmationRef} className="flex flex-col items-center space-y-4 sm:space-y-6 py-6 sm:py-8 px-2">
      {/* Icon */}
      <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-orange-100 shrink-0">
        <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 fill-orange-600" />
      </div>

      {/* Thank You Message */}
      <div className="flex flex-col items-center gap-2 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
          Obrigado, {guestName}! 🎉
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground text-center">
          Sua presença foi confirmada com sucesso.
        </p>
      </div>

      {/* Event Details Card */}
      <Card className="w-full max-w-md shadow-md">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-foreground text-center">
              Nos vemos em breve!
            </h3>
            <div className="space-y-2 text-sm sm:text-base text-foreground text-center">
              <p>
                {eventDate} às {eventTime}
              </p>
              <p>{eventLocation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center w-full max-w-md px-2">
        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="w-full sm:w-auto border-orange-600 text-orange-600 hover:bg-orange-50"
        >
          {copied ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copiar Informações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

