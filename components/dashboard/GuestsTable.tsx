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
import { Eye, Gift, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEvent } from "@/contexts/EventContext";
import { cn } from "@/lib/utils";

interface Guest {
  id: string;
  name: string;
  companionsTotal: number;
  giftsCount: number;
}

interface GuestsTableProps {
  guests: Guest[];
  matchTypes?: Array<"guest" | "companion" | null>;
  onView?: (guestId: string) => void;
}

export function GuestsTable({
  guests,
  matchTypes = [],
  onView,
}: GuestsTableProps) {
  const { settings } = useEvent();
  const MAX_COMPANIONS = settings.maxCompanionsPerGuest;

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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView?.(guest.id)}
                        className="h-8 w-8"
                        title="Ver detalhes do convidado"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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

