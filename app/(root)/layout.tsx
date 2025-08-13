import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { SessionProvider } from "next-auth/react";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <ModeToggle />
          </div>
          <div className="p-4">{children}</div>
        </main>
        <Toaster />
      </SidebarProvider>
    </SessionProvider>
  );
};

export default Layout;
