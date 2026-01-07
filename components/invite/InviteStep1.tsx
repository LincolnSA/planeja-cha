"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Heart } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import { Baby } from "lucide-react";
import { InviteStepper } from "@/components/invite/InviteStepper";

interface InviteStep1Props {
  onNext: () => void;
  currentStep?: number;
}

export function InviteStep1({ onNext, currentStep = 1 }: InviteStep1Props) {
  const { settings } = useEvent();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Icon and Title */}
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-orange-100 shrink-0">
          <Baby className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
        </div>
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground px-2">
          {settings.eventName}
        </h1>
        <p className="text-center text-base sm:text-lg text-muted-foreground font-serif px-2">
          Papais: {settings.parentsName}
        </p>
      </div>

      {/* Event Details */}
      <div className="flex gap-2 sm:gap-3 w-full sm:w-1/2 mx-auto flex-wrap justify-center px-2 sm:px-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3 rounded-lg border border-border bg-background px-3 py-2 sm:px-4 sm:py-3 flex-1 sm:flex-initial min-w-[140px]">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 shrink-0" />
          <span className="text-sm sm:text-base text-foreground truncate">{settings.date}</span>
        </div>
        <div className="flex items-center justify-center gap-2 sm:gap-3 rounded-lg border border-border bg-background px-3 py-2 sm:px-4 sm:py-3 flex-1 sm:flex-initial min-w-[140px]">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 shrink-0" />
          <span className="text-sm sm:text-base text-foreground truncate">{settings.time}</span>
        </div>
        <div className="flex items-start sm:items-center gap-2 sm:gap-3 rounded-lg border border-border bg-background px-3 py-2 sm:px-4 sm:py-3 w-full sm:flex-1 sm:flex-initial sm:min-w-[140px]">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-sm sm:text-base text-foreground break-words flex-1 text-left sm:text-center">{settings.location}</span>
        </div>
      </div>

      {/* Invitation Message */}
      {settings.customMessage && (
        <Card className="shadow-md">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 shrink-0">
                <Heart className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-sm sm:text-base text-foreground leading-relaxed px-2 whitespace-pre-line text-left">
                {settings.customMessage}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stepper - após a descrição */}
      <InviteStepper currentStep={currentStep} />

      {/* Call to Action */}
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-orange-100 shrink-0">
          <div className="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-orange-600">
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white" />
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white" />
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white" />
            </div>
          </div>
        </div>
        <h2 className="text-center text-xl sm:text-2xl font-bold text-foreground px-2">
          Você está convidado!
        </h2>
        <p className="text-center text-sm sm:text-base text-muted-foreground px-2">
          Confirme sua presença e escolha um presente especial para o bebê.
        </p>
        <Button
          onClick={onNext}
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto"
        >
          Confirmar presença
          <Heart className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

