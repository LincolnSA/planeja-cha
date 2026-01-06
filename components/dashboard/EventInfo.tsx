"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";

interface EventInfoProps {
  totalGuests: number;
  totalCompanions?: number;
  totalPeople?: number;
}

export function EventInfo({
  totalGuests,
  totalCompanions = 0,
  totalPeople,
}: EventInfoProps) {
  const { settings } = useEvent();
  
  if (!settings) {
    return null;
  }

  // Total de pessoas confirmadas (convidados + acompanhantes)
  const totalConfirmedPeople = totalPeople ?? totalGuests + totalCompanions;

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
            {totalConfirmedPeople} pessoas confirmadas
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

