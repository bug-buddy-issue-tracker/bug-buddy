import { AppSidebar } from "@/components/app-sidebar";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { OrgProvider } from "@/components/dashboard/org-context";
import { OrgSwitcher } from "@/components/dashboard/org-switcher";
import { ProjectProvider } from "@/components/dashboard/project-context";
import { ProjectSwitcher } from "@/components/dashboard/project-switcher";
import { HexagonIconNegative } from "@/components/icon";
import { NavUser } from "@/components/nav-user";
import { NotificationsBell } from "@/components/notifications-bell";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";
import { getOrgProjectsForSwitcher } from "@/server/services/projects.service";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/signin");
  }

  const memberships = await prisma.member.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  const orgs = memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
    logo: m.organization.logo,
    role: m.role,
  }));

  if (orgs.length === 0) {
    redirect("/dashboard/new");
  }

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const url = headersList.get("x-url") || headersList.get("referer") || "";
  const orgSlugMatch =
    url.match(/\/dashboard\/([^/]+)/) ??
    pathname.match(/^\/dashboard\/([^/]+)/);
  const urlOrgSlug = orgSlugMatch?.[1];

  const staticRoutes = ["new", "account", "admin"];
  const activeOrg =
    (urlOrgSlug &&
      !staticRoutes.includes(urlOrgSlug) &&
      orgs.find((o) => o.slug === urlOrgSlug)) ||
    orgs[0]!;

  const projects = await getOrgProjectsForSwitcher(activeOrg.id);

  return (
    <SidebarProvider>
      <OrgProvider orgs={orgs} activeOrg={activeOrg}>
        <ProjectProvider projects={projects} orgSlug={activeOrg.slug}>
          <AppSidebar />
          <SidebarInset>
            <header
              className="flex h-16 shrink-0 items-center gap-2 sticky top-0 z-10 bg-background w-full"
              suppressHydrationWarning
            >
              <div className="flex items-center gap-2 px-4 w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4 hidden md:block"
                />

                <div className="hidden md:flex items-center gap-2 w-full">
                  <OrgSwitcher />
                  <Separator
                    orientation="vertical"
                    className="data-[orientation=vertical]:h-4"
                  />
                  <ProjectSwitcher />
                  <Separator
                    orientation="vertical"
                    className="data-[orientation=vertical]:h-4"
                  />
                  <DashboardBreadcrumb />
                </div>

                <HexagonIconNegative className="w-5 h-5 md:hidden" />

                <div className="ml-auto flex items-center gap-2">
                  <NotificationsBell />
                  <NavUser small className="self-end md:hidden" />
                </div>
              </div>
            </header>
            <main
              className="flex flex-1 flex-col gap-4 p-4 pt-0 md:min-h-0 md:overflow-y-auto"
              suppressHydrationWarning
            >
              {children}
            </main>
          </SidebarInset>
        </ProjectProvider>
      </OrgProvider>
    </SidebarProvider>
  );
}
