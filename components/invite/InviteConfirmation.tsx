"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";

interface InviteConfirmationProps {
  guestName: string;
}

export function InviteConfirmation({ guestName }: InviteConfirmationProps) {
  const { settings } = useEvent();

  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-6 py-6 sm:py-8 px-2">
      {/* Icon */}
      <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-100 shrink-0">
        <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 fill-green-600" />
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
                {settings.date} às {settings.time}
              </p>
              <p>{settings.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

