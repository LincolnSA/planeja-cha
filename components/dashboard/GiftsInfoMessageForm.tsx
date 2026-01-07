"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useEvent } from "@/contexts/EventContext";

export function GiftsInfoMessageForm() {
  const { settings, currentEventId, updateEvent } = useEvent();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      giftsInfoMessage: settings.giftsInfoMessage || "",
    },
  });

  // Atualizar formulário quando o chá mudar
  useEffect(() => {
    form.reset({
      giftsInfoMessage: settings.giftsInfoMessage || "",
    });
  }, [settings, currentEventId, form]);

  const onSubmit = async (values: { giftsInfoMessage: string }) => {
    if (!currentEventId) return;

    try {
      setIsSubmitting(true);
      await updateEvent(currentEventId, {
        giftsInfoMessage: values.giftsInfoMessage.trim() || null,
      });
      showToast("Mensagem de informações atualizada com sucesso!", "success");
    } catch (error) {
      showToast("Erro ao atualizar mensagem. Tente novamente.", "error");
      console.error("Erro ao atualizar mensagem:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mensagem Informativa sobre os Presentes</CardTitle>
        <CardDescription>
          Adicione uma mensagem opcional que aparecerá antes da lista de presentes no convite
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="giftsInfoMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Por favor, escolha um presente da lista abaixo. Caso prefira, você também pode sugerir outro presente personalizado."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isSubmitting ? "Salvando..." : "Salvar mensagem"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

