"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
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
import { Users, Plus, ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import { CheckCircle2 } from "lucide-react";

interface InviteStep2Props {
  onNext: (guestName: string) => void;
  onBack: () => void;
}

const createConfirmationSchema = (maxCompanions: number) =>
  z.object({
    fullName: z.string().min(1, "Nome completo é obrigatório"),
    companions: z
      .array(
        z.object({
          name: z.string().min(1, "Nome completo do acompanhante é obrigatório"),
        })
      )
      .max(maxCompanions, `Máximo de ${maxCompanions} acompanhantes`)
      .optional()
      .default([]),
  });

export function InviteStep2({ onNext, onBack }: InviteStep2Props) {
  const { settings } = useEvent();
  const MAX_COMPANIONS = settings.maxCompanionsPerGuest;

  type ConfirmationFormValues = z.infer<
    ReturnType<typeof createConfirmationSchema>
  >;

  const form = useForm<ConfirmationFormValues>({
    resolver: zodResolver(createConfirmationSchema(MAX_COMPANIONS)),
    defaultValues: {
      fullName: "",
      companions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "companions",
  });

  const validCompanionsCount = fields.filter(
    (_, index) => form.watch(`companions.${index}.name`)?.trim()
  ).length;

  const handleAddCompanion = () => {
    // Limitar pelo número de inputs criados, não pelos preenchidos
    if (fields.length < MAX_COMPANIONS) {
      append({ name: "" });
    }
  };

  const onSubmit = (values: ConfirmationFormValues) => {
    // Aqui você salvaria os dados da confirmação
    console.log("Dados da confirmação:", values);
    onNext(values.fullName);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-orange-100 shrink-0">
          <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
        </div>
        <h2 className="text-center text-xl sm:text-2xl font-bold text-foreground px-2">
          Confirmação de Presença
        </h2>
        <p className="text-center text-sm sm:text-base text-muted-foreground px-2">
          Preencha seus dados para confirmar
        </p>
      </div>

      {/* Form Card */}
      <Card className="shadow-md">
        <CardContent className="p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Seus dados */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 shrink-0" />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    Seus dados
                  </h3>
                </div>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Acompanhantes */}
              <div className="space-y-3 sm:space-y-4 border-t pt-4 sm:pt-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      Acompanhantes
                    </h3>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {validCompanionsCount}/{MAX_COMPANIONS} permitidos
                  </span>
                </div>

                {fields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum acompanhante adicionado
                  </p>
                ) : (
                  <div className="space-y-3">
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
                                  placeholder="Nome completo do acompanhante"
                                  {...companionField}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="h-10 w-10 shrink-0 text-destructive hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                )}

                {fields.length < MAX_COMPANIONS && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCompanion}
                    className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 text-sm sm:text-base"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar acompanhante
                  </Button>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50 text-sm sm:text-base"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Continuar para presentes</span>
                  <span className="sm:hidden">Continuar</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

