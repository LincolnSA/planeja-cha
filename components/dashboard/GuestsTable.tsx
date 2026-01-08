"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Gift, Users, Copy, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEvent } from "@/contexts/EventContext";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Guest {
  id: string;
  name: string;
  companionsTotal: number;
  companions?: string[];
  giftsCount: number;
}

interface GuestsTableProps {
  guests: Guest[];
  matchTypes?: Array<"guest" | "companion" | null>;
  onView?: (guestId: string) => void;
  onCopy?: (guestId: string) => Promise<void>;
}

export function GuestsTable({
  guests,
  matchTypes = [],
  onView,
  onCopy,
}: GuestsTableProps) {
  const { settings } = useEvent();
  const { showToast } = useToast();
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);
  const MAX_COMPANIONS = settings.maxCompanionsPerGuest;

  const handleCopy = async (guestId: string) => {
    if (onCopy) {
      try {
        await onCopy(guestId);
        setCopiedGuestId(guestId);
        setTimeout(() => setCopiedGuestId(null), 2000);
      } catch (error) {
        showToast("Erro ao copiar informações.", "error");
      }
    }
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NOME</TableHead>
              <TableHead>ACOMPANHANTES</TableHead>
              <TableHead>PRESENTES</TableHead>
              <TableHead className="text-right">AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nenhum convidado cadastrado ainda.
                </TableCell>
              </TableRow>
            ) : (
              guests.map((guest, index) => {
                const matchType = matchTypes[index];
                const isCompanionMatch = matchType === "companion";

                return (
                  <TableRow
                    key={guest.id}
                    className={cn(
                      isCompanionMatch && "bg-orange-50/50 border-l-4 border-l-orange-500"
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {guest.name}
                        {isCompanionMatch && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-orange-100 border-orange-300 text-orange-700"
                          >
                            <Users className="h-3 w-3 mr-1" />
                            Veja os acompanhantes
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {guest.companionsTotal}/{MAX_COMPANIONS}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">
                          {guest.giftsCount ?? 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onCopy && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(guest.id)}
                            className="h-8 w-8"
                            title="Copiar informações do convidado"
                          >
                            {copiedGuestId === guest.id ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView?.(guest.id)}
                          className="h-8 w-8"
                          title="Ver detalhes do convidado"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

