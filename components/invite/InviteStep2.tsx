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
          name: z.string().min(1, "Nome do acompanhante é obrigatório"),
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
    if (validCompanionsCount < MAX_COMPANIONS) {
      append({ name: "" });
    }
  };

  const onSubmit = (values: ConfirmationFormValues) => {
    // Aqui você salvaria os dados da confirmação
    console.log("Dados da confirmação:", values);
    onNext(values.fullName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-center text-2xl font-bold text-foreground">
          Confirmação de Presença
        </h2>
        <p className="text-center text-muted-foreground">
          Preencha seus dados para confirmar
        </p>
      </div>

      {/* Form Card */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Seus dados */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-foreground">
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
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Acompanhantes
                    </h3>
                  </div>
                  <span className="text-sm text-muted-foreground">
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
                                  placeholder="Nome do acompanhante"
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

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Continuar para presentes
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

