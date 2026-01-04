"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEvent } from "@/contexts/EventContext";

const guestSettingsSchema = z.object({
  maxCompanionsPerGuest: z.coerce
    .number()
    .min(1, "A quantidade mínima é 1")
    .max(100, "A quantidade máxima é 100"),
});

type GuestSettingsFormValues = z.infer<typeof guestSettingsSchema>;

export function GuestSettingsForm() {
  const { settings, currentEventId, updateEvent } = useEvent();

  const form = useForm<GuestSettingsFormValues>({
    resolver: zodResolver(guestSettingsSchema),
    defaultValues: {
      maxCompanionsPerGuest: settings.maxCompanionsPerGuest,
    },
  });

  // Atualizar formulário quando o chá mudar
  useEffect(() => {
    form.reset({
      maxCompanionsPerGuest: settings.maxCompanionsPerGuest,
    });
  }, [settings.maxCompanionsPerGuest, currentEventId, form]);

  const onSubmit = (values: GuestSettingsFormValues) => {
    if (currentEventId) {
      updateEvent(currentEventId, {
        maxCompanionsPerGuest: values.maxCompanionsPerGuest,
      });
    }
    // Aqui você pode adicionar um toast de sucesso
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Convidados</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="maxCompanionsPerGuest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Quantidade máxima de acompanhantes por convidado
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Ex: 5"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Número máximo de acompanhantes que cada convidado pode
                    adicionar ao confirmar presença tendo como máximo 100
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white sm:w-auto"
            >
              Salvar alterações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

