"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Gift } from "@/actions/gift";

interface AddGiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (title: string, description: string, quantity: number) => void;
  onEdit?: (giftId: string, title: string, description: string, quantity: number) => void;
  giftToEdit?: Gift | null;
}

const giftFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
});

type GiftFormValues = z.infer<typeof giftFormSchema>;

export function AddGiftModal({
  open,
  onOpenChange,
  onAdd,
  onEdit,
  giftToEdit,
}: AddGiftModalProps) {
  const isEditMode = !!giftToEdit;
  const isChosen = giftToEdit?.chosen && giftToEdit.chosen > 0;

  const form = useForm<GiftFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(giftFormSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      quantity: 1,
    },
  });

  // Preencher formulário quando estiver editando ou limpar quando fechar
  useEffect(() => {
    if (open) {
      if (giftToEdit) {
        form.reset({
          title: giftToEdit.title,
          description: giftToEdit.description,
          quantity: giftToEdit.quantity,
        });
      } else {
        form.reset({
          title: "",
          description: "",
          quantity: 1,
        });
      }
    }
  }, [giftToEdit, open, form]);

  const onSubmit = (values: GiftFormValues) => {
    if (isEditMode && giftToEdit && onEdit) {
      // Se o presente já foi escolhido, usar os valores originais de título e descrição
      if (isChosen) {
        onEdit(
          giftToEdit.id,
          giftToEdit.title,
          giftToEdit.description,
          values.quantity
        );
      } else {
        onEdit(
          giftToEdit.id,
          values.title.trim(),
          values.description.trim(),
          values.quantity
        );
      }
    } else {
      onAdd(
        values.title.trim(),
        values.description.trim(),
        values.quantity
      );
    }

    handleClose();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Presente" : "Adicionar Presente"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? isChosen
                ? "Este presente já foi escolhido. Você pode editar apenas a quantidade."
                : "Edite os dados do presente."
              : "Preencha os dados do presente para adicioná-lo à lista."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Kit Banho Bebê"
                      {...field}
                      disabled={!!isChosen}
                      className={isChosen ? "bg-muted cursor-not-allowed" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Toalha, sabonete e shampoo"
                      className={`min-h-[100px] ${isChosen ? "bg-muted cursor-not-allowed" : ""}`}
                      {...field}
                      disabled={!!isChosen}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantidade */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Ex: 3"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isEditMode ? "Salvar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

