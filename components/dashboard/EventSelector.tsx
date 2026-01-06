"use client";

"use client";

import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { ChevronDown, Plus } from "lucide-react";
import { EventContext } from "@/contexts/EventContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const newEventSchema = z.object({
  eventName: z.string().min(1, "Nome do chá é obrigatório"),
  parentsName: z.string().min(1, "Nome dos pais é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  location: z.string().min(1, "Local é obrigatório"),
  customMessage: z.string().optional(),
  maxCompanionsPerGuest: z.number().min(0).max(10),
});

type NewEventFormValues = z.infer<typeof newEventSchema>;

export function EventSelector() {
  // Usar o contexto diretamente sem o hook useEvent que espera currentEvent
  const eventContext = useContext(EventContext);
  if (!eventContext) {
    throw new Error("EventSelector must be used within EventProvider");
  }

  const { events, currentEventId, setCurrentEvent, createEvent } = eventContext;
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const { showToast } = useToast();

  const form = useForm<NewEventFormValues>({
    resolver: zodResolver(newEventSchema),
    defaultValues: {
      eventName: "",
      parentsName: "",
      date: "",
      time: "",
      location: "",
      customMessage: "",
      maxCompanionsPerGuest: 5,
    },
  });

  // Resetar formulário quando o modal abrir para garantir valores vazios
  useEffect(() => {
    if (isNewEventOpen) {
      form.reset({
        eventName: "",
        parentsName: "",
        date: "",
        time: "",
        location: "",
        customMessage: "",
        maxCompanionsPerGuest: 5,
      });
    }
  }, [isNewEventOpen, form]);

  const onSubmit = async (values: NewEventFormValues) => {
    const result = await createEvent({
      ...values,
      customMessage: values.customMessage || "",
    });
    
    if (result) {
      form.reset();
      setIsNewEventOpen(false);
      showToast("Chá criado com sucesso!", "success");
      // Recarrega os eventos do banco
      await eventContext.refreshEvents();
    } else {
      showToast("Erro ao criar chá. Tente novamente.", "error");
      console.error("Erro ao criar chá");
    }
  };

  return (
    <div className="border-b border-border p-4">
      <div className="mb-2 text-xs font-medium text-muted-foreground">
        Selecione o chá
      </div>
      <div className="space-y-2">
        {events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum chá criado ainda
            </p>
          </div>
        ) : (
          <div className="relative">
            <select
              value={currentEventId || ""}
              onChange={(e) => setCurrentEvent(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.eventName}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        )}

        <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo chá
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Chá</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo chá de bebê
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Chá</FormLabel>
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
                      <FormLabel>Nome dos Pais</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Ana e João" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
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
                          placeholder="Salão de Festas Alegria - Rua das Flores, 123"
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
                      <FormLabel>Mensagem Personalizada (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Estamos muito felizes em compartilhar este momento especial com vocês!"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxCompanionsPerGuest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Máximo de Acompanhantes por Convidado</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewEventOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
                    Criar Chá
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

