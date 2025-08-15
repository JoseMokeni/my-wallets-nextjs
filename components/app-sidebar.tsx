"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Wallet,
  Tag,
  ChartAreaIcon,
  User2,
  ChevronUp,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions";

const items: { title: string; url: string; icon: React.ComponentType }[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: ChartAreaIcon,
  },
  {
    title: "Balances",
    url: "/balances",
    icon: Wallet,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Tag,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>My wallets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="h-12 md:h-auto text-base md:text-sm px-4 md:px-3 py-3 md:py-2"
                  >
                    <Link href={item.url} onClick={handleLinkClick}>
                      <item.icon />
                      <span className="font-medium md:font-normal">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:cursor-pointer h-12 md:h-auto text-base md:text-sm px-4 md:px-3 py-3 md:py-2">
                  <User2 className="h-5 w-5 md:h-4 md:w-4" />
                  <span className="font-medium md:font-normal">
                    {session?.user?.name || "User"}
                  </span>
                  <ChevronUp className="ml-auto h-5 w-5 md:h-4 md:w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[var(--radix-popper-anchor-width)]"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className="h-10 md:h-auto text-base md:text-sm"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOutUser()}
                  className="h-10 md:h-auto text-base md:text-sm"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
