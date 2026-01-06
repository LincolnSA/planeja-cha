"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { useEvent } from "@/contexts/EventContext";

const eventInfoSchema = z.object({
  eventName: z.string().min(1, "Nome do chá é obrigatório"),
  parentsName: z.string().min(1, "Nome dos pais é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  location: z.string().min(1, "Local é obrigatório"),
  customMessage: z.string().optional(),
});

type EventInfoFormValues = z.infer<typeof eventInfoSchema>;

export function EventInfoForm() {
  const { settings, currentEventId, updateEvent } = useEvent();
  const { showToast } = useToast();

  const form = useForm<EventInfoFormValues>({
    resolver: zodResolver(eventInfoSchema),
    defaultValues: {
      eventName: settings.eventName,
      parentsName: settings.parentsName,
      date: settings.date,
      time: settings.time,
      location: settings.location,
      customMessage: settings.customMessage,
    },
  });

  // Atualizar formulário quando o chá mudar
  useEffect(() => {
    form.reset({
      eventName: settings.eventName,
      parentsName: settings.parentsName,
      date: settings.date,
      time: settings.time,
      location: settings.location,
      customMessage: settings.customMessage,
    });
  }, [settings, currentEventId, form]);

  const onSubmit = async (values: EventInfoFormValues) => {
    if (currentEventId) {
      try {
        await updateEvent(currentEventId, {
          eventName: values.eventName,
          parentsName: values.parentsName,
          date: values.date,
          time: values.time,
          location: values.location,
          customMessage: values.customMessage || "",
        });
        showToast("Informações do chá atualizadas com sucesso!", "success");
      } catch (error) {
        showToast("Erro ao atualizar informações. Tente novamente.", "error");
        console.error("Erro ao atualizar evento:", error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Chá</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do chá</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Chá de Bebê do Pedro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentsName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome dos pais</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ana e João" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => {
                  // Converte DD/MM/YYYY para YYYY-MM-DD para o DatePicker
                  const convertToYYYYMMDD = (ddmmyyyy: string): string => {
                    if (!ddmmyyyy) return "";
                    const parts = ddmmyyyy.split("/");
                    if (parts.length === 3) {
                      return `${parts[2]}-${parts[1]}-${parts[0]}`;
                    }
                    return ddmmyyyy;
                  };

                  // Converte YYYY-MM-DD para DD/MM/YYYY para o formulário
                  const convertToDDMMYYYY = (yyyymmdd: string): string => {
                    if (!yyyymmdd) return "";
                    const date = new Date(yyyymmdd + "T00:00:00");
                    if (isNaN(date.getTime())) return yyyymmdd;
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                  };

                  return (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={convertToYYYYMMDD(field.value || "")}
                          onChange={(value) => {
                            field.onChange(convertToDDMMYYYY(value));
                          }}
                          placeholder="DD/MM/AAAA"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione o horário"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Salão de Festas Alegria - Rua das Flores, 123"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem personalizada</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Estamos muito felizes em compartilhar este momento especial com vocês!"
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
              className="w-full bg-orange-600 hover:bg-orange-700 text-white sm:w-auto"
            >
              Salvar alterações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

