"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";

interface EventInfoProps {
  confirmedGuests: number;
  totalGuests: number;
  totalCompanions?: number;
  totalPeople?: number;
}

export function EventInfo({
  confirmedGuests,
  totalGuests,
  totalCompanions = 0,
  totalPeople,
}: EventInfoProps) {
  const { settings } = useEvent();
  
  if (!settings) {
    return null;
  }

  // Calcular total de pessoas confirmadas (convidados + acompanhantes)
  const confirmedPeople = totalPeople ?? confirmedGuests + totalCompanions;

  // Total esperado seria todos os convidados (assumindo que cada um pode ter acompanhantes)
  // Por enquanto, vamos usar o total de convidados como base
  // Em uma implementação real, você calcularia: totalGuests + (totalGuests * maxCompanionsPerGuest)
  const maxCompanionsPerGuest = settings.maxCompanionsPerGuest;
  const totalPeopleExpected = totalGuests + (totalGuests * maxCompanionsPerGuest);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do chá</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-foreground">{settings.date}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span className="text-foreground">{settings.time}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span className="text-foreground">{settings.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-foreground">
            {confirmedPeople} de {totalPeopleExpected} pessoas confirmadas
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

