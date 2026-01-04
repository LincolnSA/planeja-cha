import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { EventProvider } from "@/contexts/EventContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EventProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto lg:ml-0">
          <div className="container mx-auto p-4 pt-16 sm:pt-6 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </EventProvider>
  );
}

