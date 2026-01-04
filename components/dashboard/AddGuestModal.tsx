"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Plus, X } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";

interface Companion {
  id: string;
  name: string;
}

interface Guest {
  id: string;
  name: string;
  companionsConfirmed: number;
  companionsTotal: number;
  companions?: { id: string; name: string }[];
  status: "confirmed" | "pending";
}

interface AddGuestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (guestName: string, companions: Companion[]) => void;
  onEdit?: (guestId: string, guestName: string, companions: Companion[]) => void;
  guestToEdit?: Guest | null;
}

const createGuestFormSchema = (maxCompanions: number) =>
  z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    companions: z
      .array(
        z.object({
          name: z.string(),
        })
      )
      .max(maxCompanions, `Máximo de ${maxCompanions} acompanhantes`)
      .optional()
      .default([]),
  });

export function AddGuestModal({
  open,
  onOpenChange,
  onAdd,
  onEdit,
  guestToEdit,
}: AddGuestModalProps) {
  const isEditMode = !!guestToEdit;
  const { settings } = useEvent();
  const MAX_COMPANIONS = settings.maxCompanionsPerGuest;

  type GuestFormValues = z.infer<ReturnType<typeof createGuestFormSchema>>;

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(createGuestFormSchema(MAX_COMPANIONS)),
    defaultValues: {
      name: "",
      companions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "companions",
  });

  // Preencher formulário quando estiver editando ou limpar quando fechar
  useEffect(() => {
    if (open) {
      if (guestToEdit) {
        // Modo de edição: preencher com dados do convidado
        const companionsData = guestToEdit.companions || [];
        form.reset({
          name: guestToEdit.name,
          companions: companionsData.length > 0
            ? companionsData.map((c) => ({ name: c.name || "" }))
            : Array.from({ length: guestToEdit.companionsTotal }, () => ({
                name: "",
              })),
        });
      } else {
        // Modo de adição: limpar formulário
        form.reset({
          name: "",
          companions: [],
        });
      }
    }
  }, [guestToEdit, open, form]);

  const validCompanionsCount = fields.filter(
    (_, index) => form.watch(`companions.${index}.name`)?.trim()
  ).length;

  const handleAddCompanion = () => {
    if (validCompanionsCount < MAX_COMPANIONS) {
      append({ name: "" });
    }
  };

  const handleRemoveCompanion = (index: number) => {
    remove(index);
  };

  const onSubmit = (values: GuestFormValues) => {
    // Filtrar apenas acompanhantes com nome preenchido e limitar a MAX_COMPANIONS
    const validCompanions: Companion[] = values.companions
      .filter((c) => c.name.trim())
      .slice(0, MAX_COMPANIONS)
      .map((c, index) => {
        // Preservar IDs existentes ao editar
        if (isEditMode && guestToEdit?.companions?.[index]) {
          return {
            id: guestToEdit.companions[index].id,
            name: c.name.trim(),
          };
        }
        return {
          id: `companion-${index}-${Date.now()}`,
          name: c.name.trim(),
        };
      });

    if (isEditMode && guestToEdit && onEdit) {
      onEdit(guestToEdit.id, values.name.trim(), validCompanions);
    } else {
      onAdd(values.name.trim(), validCompanions);
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
            {isEditMode ? "Editar Convidado" : "Adicionar Convidado"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edite os dados do convidado."
              : "Preencha os dados do convidado para adicioná-lo à lista."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Nome completo */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome do convidado"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Acompanhantes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel>Acompanhantes</FormLabel>
                <span className="text-sm text-muted-foreground">
                  {validCompanionsCount}/{MAX_COMPANIONS}
                </span>
              </div>

              {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum acompanhante adicionado
                </p>
              ) : (
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`companions.${index}.name`}
                      render={({ field: companionField }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormControl className="flex-1">
                              <Input
                                placeholder="Nome do acompanhante"
                                {...companionField}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveCompanion(index)}
                              className="h-10 w-10 shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              )}

              {validCompanionsCount < MAX_COMPANIONS && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCompanion}
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar acompanhante
                </Button>
              )}
            </div>

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
                className="bg-green-600 hover:bg-green-700 text-white"
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
