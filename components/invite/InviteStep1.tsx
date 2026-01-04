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
    <div className="space-y-8">
      {/* Icon and Title */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Baby className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-center text-4xl font-serif font-bold text-foreground">
          {settings.eventName}
        </h1>
        <p className="text-center text-lg text-muted-foreground font-serif">
          {settings.parentsName}
        </p>
      </div>

      {/* Event Details */}
      <div className="flex gap-3 w-1/2 mx-auto flex-wrap justify-center">
        <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
          <Calendar className="h-5 w-5 text-green-600" />
          <span className="text-foreground">{settings.date}</span>
        </div>
        <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
          <Clock className="h-5 w-5 text-green-600" />
          <span className="text-foreground">{settings.time}</span>
        </div>
        <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
          <MapPin className="h-5 w-5 text-green-600" />
          <span className="text-foreground">{settings.location}</span>
        </div>
      </div>

      {/* Invitation Message */}
      {settings.customMessage && (
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-foreground leading-relaxed">
                {settings.customMessage}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stepper - após a descrição */}
      <InviteStepper currentStep={currentStep} />

      {/* Call to Action */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-white" />
              <div className="h-2 w-2 rounded-full bg-white" />
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold text-foreground">
          Você está convidado!
        </h2>
        <p className="text-center text-muted-foreground">
          Confirme sua presença e escolha um presente especial para o bebê.
        </p>
        <Button
          onClick={onNext}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          Confirmar presença
          <Heart className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

