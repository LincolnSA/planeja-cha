"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getTeas, createTea, updateTea, deleteTea } from "@/actions/tea";
import type { CreateTeaInput } from "@/actions/tea/validate-tea-input";
import { normalizeDateTime } from "@/actions/tea/normalize-datetime";

export interface EventSettings {
  id: string;
  eventName: string;
  parentsName: string;
  date: string;
  time: string;
  location: string;
  customMessage: string;
  giftsInfoMessage: string | null;
  maxCompanionsPerGuest: number;
  inviteLink: string;
  isActive: boolean;
  requireGiftSelection: boolean;
  createdAt: string;
}

interface EventContextType {
  events: EventSettings[];
  currentEventId: string | null;
  currentEvent: EventSettings | null;
  setCurrentEvent: (eventId: string) => void;
  createEvent: (eventData: Omit<EventSettings, "id" | "createdAt" | "inviteLink">) => Promise<string | null>;
  updateEvent: (eventId: string, settings: Partial<EventSettings>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  getEventById: (eventId: string) => EventSettings | undefined;
  refreshEvents: () => Promise<void>;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);

/**
 * Converte Tea do banco para EventSettings do contexto
 */
function mapTeaToEventSettings(tea: {
  id: string;
  name: string;
  parentsName: string;
  date: string;
  time: Date;
  location: string;
  customMessage: string;
  giftsInfoMessage: string | null;
  maxCompanionsPerGuest: number;
  inviteLink: string;
  isActive: boolean;
  requireGiftSelection: boolean;
  createdAt: Date;
}): EventSettings {
  // Converte Date para string no formato HH:MM
  const timeString = tea.time instanceof Date 
    ? `${String(tea.time.getHours()).padStart(2, '0')}:${String(tea.time.getMinutes()).padStart(2, '0')}`
    : String(tea.time);

  // Converte YYYY-MM-DD para DD/MM/YYYY
  const convertToDDMMYYYY = (yyyymmdd: string): string => {
    if (!yyyymmdd) return "";
    // Se já está no formato DD/MM/YYYY, retorna como está
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(yyyymmdd)) {
      return yyyymmdd;
    }
    // Converte YYYY-MM-DD para DD/MM/YYYY
    const date = new Date(yyyymmdd + "T00:00:00");
    if (isNaN(date.getTime())) return yyyymmdd;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    id: tea.id,
    eventName: tea.name,
    parentsName: tea.parentsName,
    date: convertToDDMMYYYY(tea.date),
    time: timeString,
    location: tea.location,
    customMessage: tea.customMessage,
    giftsInfoMessage: tea.giftsInfoMessage,
    maxCompanionsPerGuest: tea.maxCompanionsPerGuest,
    inviteLink: tea.inviteLink,
    isActive: tea.isActive,
    requireGiftSelection: tea.requireGiftSelection,
    createdAt: tea.createdAt.toISOString(),
  };
}

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventSettings[]>([]);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);

  // Carrega eventos do banco na inicialização
  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const teas = await getTeas();
      const mappedEvents = teas.map(mapTeaToEventSettings);
      setEvents(mappedEvents);
      
      // Se não há evento selecionado e há eventos, seleciona o primeiro
      setCurrentEventId((prevId) => {
        if (!prevId && mappedEvents.length > 0) {
          return mappedEvents[0].id;
        }
        return prevId;
      });
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const currentEvent = events.find((e) => e.id === currentEventId) || null;

  const setCurrentEvent = (eventId: string) => {
    if (events.some((e) => e.id === eventId)) {
      setCurrentEventId(eventId);
    }
  };

  const createEvent = async (
    eventData: Omit<EventSettings, "id" | "createdAt" | "inviteLink">
  ): Promise<string | null> => {
    try {
      // Converte DD/MM/YYYY para YYYY-MM-DD para a action
      const convertToYYYYMMDD = (ddmmyyyy: string): string => {
        if (!ddmmyyyy) return "";
        const parts = ddmmyyyy.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        // Se já está no formato YYYY-MM-DD, retorna como está
        return ddmmyyyy;
      };

      const input: CreateTeaInput = {
        name: eventData.eventName,
        parentsName: eventData.parentsName,
        date: convertToYYYYMMDD(eventData.date),
        time: eventData.time,
        location: eventData.location,
        customMessage: eventData.customMessage || "",
        maxCompanionsPerGuest: eventData.maxCompanionsPerGuest,
      };

      const result = await createTea(input);
      
      if (result.success) {
        const newEvent = mapTeaToEventSettings(result.data);
        setEvents((prev) => [...prev, newEvent]);
        setCurrentEventId(newEvent.id);
        // Recarrega os eventos do banco para garantir sincronização
        await loadEvents();
        return newEvent.id;
      } else {
        // Log do erro para debug
        console.error("Erro ao criar chá:", result.error);
      }
      
      return null;
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      return null;
    }
  };

  const updateEvent = async (
    eventId: string,
    settings: Partial<EventSettings>
  ): Promise<void> => {
    try {
      // Converte DD/MM/YYYY para YYYY-MM-DD para a action
      const convertToYYYYMMDD = (ddmmyyyy: string): string => {
        if (!ddmmyyyy) return "";
        const parts = ddmmyyyy.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        // Se já está no formato YYYY-MM-DD, retorna como está
        return ddmmyyyy;
      };

      const updateData: {
        name?: string;
        parentsName?: string;
        date?: string;
        time?: Date;
        location?: string;
        customMessage?: string;
        giftsInfoMessage?: string | null;
        maxCompanionsPerGuest?: number;
        isActive?: boolean;
        requireGiftSelection?: boolean;
      } = {};
      
      if (settings.eventName !== undefined) updateData.name = settings.eventName;
      if (settings.parentsName !== undefined) updateData.parentsName = settings.parentsName;
      if (settings.date !== undefined) updateData.date = convertToYYYYMMDD(settings.date);
      if (settings.time !== undefined) {
        // Se date ou time foram fornecidos, normaliza o time
        const date = settings.date ? convertToYYYYMMDD(settings.date) : undefined;
        const time = settings.time;
        if (date) {
          updateData.time = normalizeDateTime(date, time);
        } else {
          // Se não há date, usa a data atual do evento
          const currentEvent = events.find(e => e.id === eventId);
          if (currentEvent) {
            const currentDate = convertToYYYYMMDD(currentEvent.date);
            updateData.time = normalizeDateTime(currentDate, time);
          } else {
            // Se não há evento atual, usa a data de hoje
            const today = new Date().toISOString().split('T')[0];
            updateData.time = normalizeDateTime(today, time);
          }
        }
      }
      if (settings.location !== undefined) updateData.location = settings.location;
      if (settings.customMessage !== undefined) updateData.customMessage = settings.customMessage;
      if (settings.giftsInfoMessage !== undefined) updateData.giftsInfoMessage = settings.giftsInfoMessage;
      if (settings.maxCompanionsPerGuest !== undefined) {
        updateData.maxCompanionsPerGuest = settings.maxCompanionsPerGuest;
      }
      if (settings.requireGiftSelection !== undefined) {
        updateData.requireGiftSelection = settings.requireGiftSelection;
      }

      const updated = await updateTea(eventId, updateData);
      
      if (updated) {
        const updatedEvent = mapTeaToEventSettings(updated);
        setEvents((prev) =>
          prev.map((event) => (event.id === eventId ? updatedEvent : event))
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
    }
  };

  const deleteEvent = async (eventId: string): Promise<void> => {
    try {
      const success = await deleteTea(eventId);
      
      if (success) {
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
        
        // Se o evento deletado era o atual, seleciona outro
        if (currentEventId === eventId) {
          const remainingEvents = events.filter((event) => event.id !== eventId);
          setCurrentEventId(remainingEvents.length > 0 ? remainingEvents[0].id : null);
        }
      }
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
    }
  };

  const getEventById = (eventId: string) => {
    return events.find((e) => e.id === eventId);
  };

  const refreshEvents = async () => {
    await loadEvents();
  };

  return (
    <EventContext.Provider
      value={{
        events,
        currentEventId,
        currentEvent,
        setCurrentEvent,
        createEvent,
        updateEvent,
        deleteEvent,
        getEventById,
        refreshEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  if (!context.currentEvent) {
    throw new Error("Nenhum chá selecionado");
  }
  return {
    ...context,
    settings: context.currentEvent, // Para manter compatibilidade com código existente
    updateSettings: async (settings: Partial<EventSettings>) => {
      // Wrapper para manter compatibilidade
      if (context.currentEventId) {
        await context.updateEvent(context.currentEventId, settings);
      }
    },
  };
}
