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
import { Eye, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEvent } from "@/contexts/EventContext";

interface Guest {
  id: string;
  name: string;
  companionsTotal: number;
  giftsCount: number;
}

interface GuestsTableProps {
  guests: Guest[];
  onView?: (guestId: string) => void;
}

export function GuestsTable({
  guests,
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
              guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{guest.name}</TableCell>
                  <TableCell>
                    {guest.companionsTotal}/{MAX_COMPANIONS}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-green-600" />
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

