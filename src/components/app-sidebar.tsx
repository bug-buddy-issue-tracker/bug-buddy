"use client";

import {
  BarChart3,
  LayoutDashboard,
  MessageSquare,
  Settings2,
  Shield,
} from "lucide-react";
import * as React from "react";

import { useSession } from "@/components/auth/session-provider";
import { OrgSwitcher } from "@/components/dashboard/org-switcher";
import { useProject } from "@/components/dashboard/project-context";
import { ProjectSwitcher } from "@/components/dashboard/project-switcher";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { HexagonIconNegative } from "./icon";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSession();
  const { currentProjectSlug, orgSlug } = useProject();
  const isAdmin = user?.role === "admin";

  const projectBase = currentProjectSlug
    ? `/dashboard/${orgSlug}/${currentProjectSlug}`
    : `/dashboard/${orgSlug}`;

  const navItems = [
    {
      title: "Dashboard",
      url: projectBase,
      icon: LayoutDashboard,
    },
    {
      title: "Feedback",
      url: currentProjectSlug ? `${projectBase}/feedback` : "/dashboard",
      icon: MessageSquare,
    },
    {
      title: "Analytics",
      url: currentProjectSlug ? `${projectBase}/analytics` : "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: currentProjectSlug ? `${projectBase}/settings` : "/dashboard",
      icon: Settings2,
    },
    ...(isAdmin
      ? [
          {
            title: "Admin",
            url: "/dashboard/admin",
            icon: Shield,
          },
        ]
      : []),
  ];
  return (
    <Sidebar variant="inset" {...props} suppressHydrationWarning>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <HexagonIconNegative className="w-6 h-6" />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Bug Buddy</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex-col gap-2 px-2 flex md:hidden">
          <OrgSwitcher className="w-full" />
          <ProjectSwitcher className="w-full" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
