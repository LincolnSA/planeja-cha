"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { SettingsHeader } from "@/components/dashboard/SettingsHeader";
import { EventInfoForm } from "@/components/dashboard/EventInfoForm";
import { GuestSettingsForm } from "@/components/dashboard/GuestSettingsForm";
import { TeaStatusSwitch } from "@/components/dashboard/TeaStatusSwitch";
import { InviteModal } from "@/components/dashboard/InviteModal";
import { DeleteTeaModal } from "@/components/dashboard/DeleteTeaModal";
import { WelcomeScreen } from "@/components/dashboard/WelcomeScreen";
import { EventContext } from "@/contexts/EventContext";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function SettingsPage() {
  const eventContext = useContext(EventContext);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  // Se não há eventos ou não há evento selecionado, mostrar tela de boas-vindas
  if (!eventContext || eventContext.events.length === 0 || !eventContext.currentEvent) {
    return <WelcomeScreen />;
  }

  const currentEvent = eventContext.currentEvent!;

  const handleDeleteTea = async () => {
    if (!currentEvent.id) return;

    try {
      const eventIdToDelete = currentEvent.id;
      await eventContext.deleteEvent(eventIdToDelete);
      
      // Recarregar eventos do banco para garantir sincronização
      await eventContext.refreshEvents();
      
      showToast("Chá deletado com sucesso!", "success");
      
      // Aguardar um pouco para o estado atualizar e verificar se ainda há eventos
      setTimeout(() => {
        if (eventContext.events.length === 0) {
          router.push("/dashboard");
        }
      }, 300);
    } catch (error) {
      showToast("Erro ao deletar chá. Tente novamente.", "error");
      console.error("Erro ao deletar chá:", error);
    }
  };

  return (
    <div className="space-y-6">
      <SettingsHeader
        eventName={currentEvent.eventName}
        onViewInvite={() => setIsInviteModalOpen(true)}
      />

      <EventInfoForm />

      <GuestSettingsForm />

      <TeaStatusSwitch />

      {/* Seção de Excluir Chá */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
          <CardDescription>
            Ações irreversíveis relacionadas ao seu chá de bebê
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Excluir Chá de Bebê
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ao excluir este chá, todas as informações relacionadas serão permanentemente removidas. Esta ação não pode ser desfeita.
              </p>
              <Button
                variant="destructive"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Chá
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <InviteModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
      />

      <DeleteTeaModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        teaName={currentEvent.eventName}
        onConfirm={handleDeleteTea}
      />
    </div>
  );
}

