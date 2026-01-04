"use client";

import { Button } from "@/components/ui/button";
import { Clock, BarChart3, Users, Gift, Settings, Copy, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { EventSelector } from "@/components/dashboard/EventSelector";
import { useContext } from "react";
import { EventContext } from "@/contexts/EventContext";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Convidados",
    href: "/dashboard/convidados",
    icon: Users,
  },
  {
    name: "Presentes",
    href: "/dashboard/presentes",
    icon: Gift,
  },
  {
    name: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const eventContext = useContext(EventContext);
  const currentEvent = eventContext?.currentEvent || null;

  const copyInviteLink = () => {
    if (currentEvent) {
      navigator.clipboard.writeText(currentEvent.inviteLink);
      // Você pode adicionar um toast aqui para feedback
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-600">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-foreground">
            Planeja Chá
          </span>
          <span className="text-xs text-muted-foreground">Painel Admin</span>
        </div>
      </div>

      {/* Event Selector */}
      <EventSelector />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-green-600 text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Invite Link */}
      {currentEvent && (
        <div className="border-t border-border p-4">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            Link do convite
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-2">
            <span className="flex-1 truncate text-xs text-foreground">
              {currentEvent.inviteLink}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={copyInviteLink}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
      {!currentEvent && eventContext && eventContext.events.length === 0 && (
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground text-center">
            Crie seu primeiro chá para começar
          </p>
        </div>
      )}

      {/* Logout */}
      <div className="border-t border-border p-4">
        <Link
          href="/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Link>
      </div>
    </div>
  );
}

