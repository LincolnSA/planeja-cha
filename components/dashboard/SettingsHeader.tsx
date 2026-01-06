"use client";

import { Button } from "@/components/ui/button";

interface SettingsHeaderProps {
  eventName: string;
  onViewInvite?: () => void;
}

export function SettingsHeader({ eventName, onViewInvite }: SettingsHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">{eventName}</p>
      </div>
      <Button
        onClick={onViewInvite}
        variant="outline"
        className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
      >
        Ver convite
      </Button>
    </div>
  );
}

