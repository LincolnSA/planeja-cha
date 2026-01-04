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
    <div className="flex flex-col items-center space-y-6 py-8">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Heart className="h-8 w-8 text-green-600 fill-green-600" />
      </div>

      {/* Thank You Message */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl font-bold text-foreground">
          Obrigado, {guestName}! 🎉
        </h2>
        <p className="text-lg text-muted-foreground">
          Sua presença foi confirmada com sucesso.
        </p>
      </div>

      {/* Event Details Card */}
      <Card className="w-full max-w-md shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground text-center">
              Nos vemos em breve!
            </h3>
            <div className="space-y-2 text-foreground text-center">
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

