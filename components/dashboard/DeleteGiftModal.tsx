"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteGiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  giftTitle: string;
  giftChosen?: number;
  onConfirm: () => void;
}

export function DeleteGiftModal({
  open,
  onOpenChange,
  giftTitle,
  giftChosen = 0,
  onConfirm,
}: DeleteGiftModalProps) {
  const canDelete = giftChosen === 0;
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>Excluir Presente</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {canDelete ? (
              <>
                Tem certeza que deseja excluir o presente{" "}
                <span className="font-semibold text-foreground">{giftTitle}</span>?
                <br />
                <br />
                Esta ação não pode ser desfeita. Todos os dados relacionados a este presente serão permanentemente excluídos, incluindo:
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Informações do presente</li>
                  <li>Quantidade disponível</li>
                </ul>
              </>
            ) : (
              <>
                Não é possível excluir o presente{" "}
                <span className="font-semibold text-foreground">{giftTitle}</span>.
                <br />
                <br />
                Este presente já foi escolhido por <span className="font-semibold text-foreground">{giftChosen} convidado(s)</span>. Para manter a integridade dos dados, apenas presentes não escolhidos podem ser excluídos.
                <br />
                <br />
                Se desejar remover este presente, primeiro é necessário que os convidados desmarquem suas escolhas.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {canDelete ? "Cancelar" : "Fechar"}
          </Button>
          {canDelete && (
            <Button
              onClick={handleConfirm}
              variant="destructive"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Deletar Presente
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

