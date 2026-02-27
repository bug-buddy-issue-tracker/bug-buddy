import { getSession } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";
import { getOrgProjectsForSwitcher } from "@/server/services/projects.service";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Bug Buddy",
  description: "Overview of your bug reports, feedback, and project statistics",
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/");
  }

  const firstMembership = await prisma.member.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  if (!firstMembership) {
    redirect("/dashboard/new");
  }

  const projects = await getOrgProjectsForSwitcher(
    firstMembership.organizationId,
  );
  const firstProject = projects[0];

  if (!firstProject) {
    redirect("/dashboard/new");
  }

  redirect(
    `/dashboard/${firstMembership.organization.slug}/${firstProject.slug}`,
  );
}
