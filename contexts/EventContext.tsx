"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface EventSettings {
  id: string;
  eventName: string;
  parentsName: string;
  date: string;
  time: string;
  location: string;
  customMessage: string;
  maxCompanionsPerGuest: number;
  inviteLink: string;
  createdAt: string;
}

interface EventContextType {
  events: EventSettings[];
  currentEventId: string | null;
  currentEvent: EventSettings | null;
  setCurrentEvent: (eventId: string) => void;
  createEvent: (eventData: Omit<EventSettings, "id" | "createdAt" | "inviteLink">) => string;
  updateEvent: (eventId: string, settings: Partial<EventSettings>) => void;
  deleteEvent: (eventId: string) => void;
  getEventById: (eventId: string) => EventSettings | undefined;
}

// Não usar eventos padrão - deixar o usuário criar o primeiro
const defaultEvents: EventSettings[] = [];

export const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventSettings[]>(() => {
    // Carregar do localStorage se existir
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("planeja-cha-events");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return defaultEvents;
        }
      }
    }
    return defaultEvents;
  });

  const [currentEventId, setCurrentEventId] = useState<string | null>(() => {
    // Carregar do localStorage se existir
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("planeja-cha-current-event");
      if (stored) {
        return stored;
      }
    }
    return events.length > 0 ? events[0].id : null;
  });

  // Salvar no localStorage quando mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("planeja-cha-events", JSON.stringify(events));
    }
  }, [events]);

  useEffect(() => {
    if (typeof window !== "undefined" && currentEventId) {
      localStorage.setItem("planeja-cha-current-event", currentEventId);
    }
  }, [currentEventId]);

  const currentEvent = events.find((e) => e.id === currentEventId) || null;

  const setCurrentEvent = (eventId: string) => {
    if (events.some((e) => e.id === eventId)) {
      setCurrentEventId(eventId);
    }
  };

  const createEvent = (
    eventData: Omit<EventSettings, "id" | "createdAt" | "inviteLink">
  ): string => {
    const newEvent: EventSettings = {
      ...eventData,
      id: Date.now().toString(),
      inviteLink: `http://localhost:8080/convite/${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [...prev, newEvent]);
    setCurrentEventId(newEvent.id);
    return newEvent.id;
  };

  const updateEvent = (eventId: string, settings: Partial<EventSettings>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, ...settings } : event))
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    if (currentEventId === eventId) {
      const remainingEvents = events.filter((event) => event.id !== eventId);
      setCurrentEventId(remainingEvents.length > 0 ? remainingEvents[0].id : null);
    }
  };

  const getEventById = (eventId: string) => {
    return events.find((e) => e.id === eventId);
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
    updateSettings: (settings: Partial<EventSettings>) => {
      // Wrapper para manter compatibilidade
      if (context.currentEventId) {
        context.updateEvent(context.currentEventId, settings);
      }
    },
  };
}
