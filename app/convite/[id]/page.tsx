"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { Calendar, Clock, MapPin, Heart, Baby, CheckCircle2, Users, Plus, ArrowLeft, ArrowRight, X } from "lucide-react";
import { InviteStep1 } from "@/components/invite/InviteStep1";
import { InviteStep2 } from "@/components/invite/InviteStep2";
import { InviteStep3 } from "@/components/invite/InviteStep3";
import { InviteConfirmation } from "@/components/invite/InviteConfirmation";
import { InviteStepper } from "@/components/invite/InviteStepper";
import { getTeaPublic } from "@/actions/tea/get-tea-public";
import { getGiftsPublic } from "@/actions/gift";
import { confirmPresenceAndSelectGifts } from "@/actions/guest";
import type { PublicTea } from "@/actions/tea/get-tea-public";
import type { Gift } from "@/actions/gift";
import { useToast } from "@/components/ui/toast";

export default function InvitePage() {
  const params = useParams();
  const teaId = typeof params.id === "string" ? params.id : null;
  const [currentStep, setCurrentStep] = useState(1);
  const [guestName, setGuestName] = useState<string>("");
  const [companions, setCompanions] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tea, setTea] = useState<PublicTea | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  // Garantir que o componente está montado no cliente antes de renderizar
  useEffect(() => {
    setMounted(true);
  }, []);

  // Carregar dados do tea e presentes
  useEffect(() => {
    if (!mounted || !teaId) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [teaData, giftsData] = await Promise.all([
          getTeaPublic(teaId),
          getGiftsPublic(teaId),
        ]);

        if (teaData) {
          setTea(teaData);
          setGifts(giftsData);
        } else {
          showToast("Convite não encontrado.", "error");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do convite:", error);
        showToast("Erro ao carregar convite. Tente novamente.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teaId, mounted]);

  const handleNext = (name?: string) => {
    if (name) {
      setGuestName(name);
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmPresence = (
    guestName: string,
    companionsList: string[]
  ) => {
    // Apenas armazena os dados em estado, não salva no banco ainda
    setGuestName(guestName);
    setCompanions(companionsList);
    setCurrentStep(3);
  };

  const handleSelectGifts = async (
    selectedGifts: Array<{ id: string | null; customGift?: string }>
  ) => {
    if (!tea || !guestName.trim()) {
      showToast("Erro: dados do convidado não encontrados.", "error");
      return;
    }

    try {
      const giftIds: string[] = [];
      const customGifts: Array<{ title: string; description?: string }> = [];

      selectedGifts.forEach((gift) => {
        if (gift.id) {
          giftIds.push(gift.id);
        } else if (gift.customGift) {
          customGifts.push({ title: gift.customGift });
        }
      });

      // Salva tudo de uma vez: convidado + acompanhantes + presentes
      const result = await confirmPresenceAndSelectGifts({
        teaId: tea.id,
        guestName: guestName.trim(),
        companions: companions.filter((c) => c.trim()),
        giftIds,
        customGifts,
      });

      if (result.success) {
        setShowConfirmation(true);
      } else {
        showToast(result.error || "Erro ao confirmar presença e selecionar presentes.", "error");
      }
    } catch (error) {
      showToast("Erro ao confirmar presença. Tente novamente.", "error");
      console.error("Erro ao confirmar presença:", error);
    }
  };

  // Não renderizar até que o componente esteja montado no cliente
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          </div>
          <p className="text-muted-foreground">Carregando convite...</p>
        </div>
      </div>
    );
  }

  if (!tea) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              Convite não encontrado
            </h1>
            <p className="text-muted-foreground">
              O link do convite pode estar incorreto ou o convite pode ter sido removido.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Criar um objeto settings compatível com os componentes de convite
  // O time já vem formatado como string (HH:MM) da server action
  const settings = {
    eventName: tea.name,
    parentsName: tea.parentsName,
    date: tea.date,
    time: tea.time, // Já vem como string formatada (HH:MM)
    location: tea.location,
    customMessage: tea.customMessage,
    maxCompanionsPerGuest: tea.maxCompanionsPerGuest,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg">
          {showConfirmation ? (
            <InviteConfirmationWrapper
              guestName={guestName}
              settings={settings}
            />
          ) : (
            <>
              {currentStep === 1 && (
                <InviteStep1Wrapper
                  settings={settings}
                  onNext={handleNext}
                  currentStep={currentStep}
                />
              )}
              {currentStep === 2 && (
                <InviteStep2Wrapper
                  settings={settings}
                  onNext={(guestName: string, companions: string[]) => {
                    handleConfirmPresence(guestName, companions);
                  }}
                  onBack={handleBack}
                />
              )}
              {currentStep === 3 && (
                <InviteStep3
                  gifts={gifts}
                  onBack={handleBack}
                  onConfirm={handleSelectGifts}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrapper para InviteConfirmation que não depende do EventContext
function InviteConfirmationWrapper({
  guestName,
  settings,
}: {
  guestName: string;
  settings: {
    date: string;
    time: string;
    location: string;
  };
}) {
  return (
    <div className="flex flex-col items-center space-y-6 py-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Heart className="h-8 w-8 text-green-600 fill-green-600" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl font-bold text-foreground">
          Obrigado, {guestName}! 🎉
        </h2>
        <p className="text-lg text-muted-foreground">
          Sua presença foi confirmada com sucesso.
        </p>
      </div>

      <Card className="w-full max-w-md shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground text-center">
              Nos vemos em breve!
            </h3>
            <div className="space-y-2 text-foreground text-center">
              <p>
                {settings.date} às {settings.time}
              </p>
              <p>{settings.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Wrapper para InviteStep1 que não depende do EventContext
function InviteStep1Wrapper({
  settings,
  onNext,
  currentStep,
}: {
  settings: {
    eventName: string;
    parentsName: string;
    date: string;
    time: string;
    location: string;
    customMessage: string;
  };
  onNext: () => void;
  currentStep: number;
}) {
  return (
    <div className="space-y-8">
      {/* Icon and Title */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Baby className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-center text-4xl font-serif font-bold text-foreground">
          {settings.eventName}
        </h1>
        <p className="text-center text-lg text-muted-foreground font-serif">
          {settings.parentsName}
        </p>
      </div>

      {/* Event Details */}
      <div className="flex gap-3 w-1/2 mx-auto flex-wrap justify-center">
        <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
          <Calendar className="h-5 w-5 text-green-600" />
          <span className="text-foreground">{settings.date}</span>
        </div>
        <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
          <Clock className="h-5 w-5 text-green-600" />
          <span className="text-foreground">{settings.time}</span>
        </div>
        <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
          <MapPin className="h-5 w-5 text-green-600" />
          <span className="text-foreground">{settings.location}</span>
        </div>
      </div>

      {/* Invitation Message */}
      {settings.customMessage && (
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-foreground leading-relaxed">
                {settings.customMessage}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stepper - após a descrição */}
      <InviteStepper currentStep={currentStep} />

      {/* Call to Action */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-white" />
              <div className="h-2 w-2 rounded-full bg-white" />
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold text-foreground">
          Você está convidado!
        </h2>
        <p className="text-center text-muted-foreground">
          Confirme sua presença e escolha um presente especial para o bebê.
        </p>
        <Button
          onClick={onNext}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          Confirmar presença
          <Heart className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Wrapper para InviteStep2 que não depende do EventContext
function InviteStep2Wrapper({
  settings,
  onNext,
  onBack,
}: {
  settings: {
    maxCompanionsPerGuest: number;
  };
  onNext: (guestName: string, companions: string[]) => void;
  onBack: () => void;
}) {
  const MAX_COMPANIONS = settings.maxCompanionsPerGuest;

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

  type ConfirmationFormValues = z.infer<
    ReturnType<typeof createConfirmationSchema>
  >;

  const form = useForm<ConfirmationFormValues>({
    resolver: zodResolver(createConfirmationSchema(MAX_COMPANIONS)) as any,
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
    const companionsList = values.companions
      .map((c) => c.name)
      .filter((name) => name.trim());
    onNext(values.fullName, companionsList);
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

                {fields.length < MAX_COMPANIONS && (
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

