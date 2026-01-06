"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Gift, User } from "lucide-react";
import type { GuestDetails } from "@/actions/guest/get-guest-by-id";

interface GuestDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: GuestDetails | null;
  isLoading?: boolean;
}

export function GuestDetailsModal({
  open,
  onOpenChange,
  guest,
  isLoading = false,
}: GuestDetailsModalProps) {
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Carregando informações...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Buscando dados do convidado...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!guest) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Erro</DialogTitle>
            <DialogDescription>
              Não foi possível carregar as informações do convidado.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Informações do Convidado</DialogTitle>
          <DialogDescription>
            Detalhes completos do convidado e suas escolhas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-orange-600" />
                <CardTitle>Informações Básicas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome</p>
                <p className="text-base font-semibold text-foreground">{guest.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Cadastro</p>
                <p className="text-sm text-foreground">
                  {new Date(guest.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acompanhantes */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                <CardTitle>
                  Acompanhantes ({guest.companions.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {guest.companions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum acompanhante cadastrado.
                </p>
              ) : (
                <ul className="space-y-2">
                  {guest.companions.map((companion) => (
                    <li
                      key={companion.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {companion.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Presentes Escolhidos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-orange-600" />
                <CardTitle>
                  Presentes Escolhidos ({guest.giftSelections.length + guest.customGifts.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Presentes da Lista */}
              {guest.giftSelections.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Presentes da Lista ({guest.giftSelections.length})
                  </p>
                  <ul className="space-y-2">
                    {guest.giftSelections.map((selection) => (
                      <li
                        key={selection.id}
                        className="p-3 rounded-lg border border-border bg-background"
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {selection.gift.title}
                        </p>
                        {selection.gift.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {selection.gift.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Presentes Customizados */}
              {guest.customGifts.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Presentes Customizados ({guest.customGifts.length})
                  </p>
                  <ul className="space-y-2">
                    {guest.customGifts.map((customGift) => (
                      <li
                        key={customGift.id}
                        className="p-3 rounded-lg border border-border bg-background"
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {customGift.title}
                        </p>
                        {customGift.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {customGift.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {guest.giftSelections.length === 0 && guest.customGifts.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum presente escolhido ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

