"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, Sparkles, Gift, Users, Calendar } from "lucide-react";
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
import { useContext, useState } from "react";
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

export function WelcomeScreen() {
  const eventContext = useContext(EventContext);
  if (!eventContext) {
    throw new Error("WelcomeScreen must be used within EventProvider");
  }

  const { createEvent } = eventContext;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const onSubmit = (values: NewEventFormValues) => {
    createEvent({
      ...values,
      customMessage: values.customMessage || "",
    });
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full">
        <CardContent className="p-8 sm:p-12">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Baby className="h-10 w-10 text-green-600" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                Bem-vindo ao Planeja Chá!
              </h1>
              <p className="text-lg text-muted-foreground">
                Comece criando seu primeiro chá de bebê
              </p>
            </div>

            {/* Features */}
            <div className="grid gap-4 sm:grid-cols-3 w-full mt-8">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-50">
                <Users className="h-8 w-8 text-green-600" />
                <p className="text-sm font-medium text-foreground">
                  Gerencie Convidados
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-50">
                <Gift className="h-8 w-8 text-green-600" />
                <p className="text-sm font-medium text-foreground">
                  Organize Presentes
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-50">
                <Calendar className="h-8 w-8 text-green-600" />
                <p className="text-sm font-medium text-foreground">
                  Acompanhe Confirmações
                </p>
              </div>
            </div>

            {/* CTA */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 mt-4"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Criar meu primeiro chá
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar seu primeiro chá</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do seu chá de bebê para começar
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="eventName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Chá</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Chá de Bebê do Pedro"
                              {...field}
                            />
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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data</FormLabel>
                            <FormControl>
                              <Input placeholder="15/03/2026" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horário</FormLabel>
                            <FormControl>
                              <Input placeholder="15:00" {...field} />
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
                          <FormLabel>
                            Máximo de Acompanhantes por Convidado
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
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
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Criar Chá
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

