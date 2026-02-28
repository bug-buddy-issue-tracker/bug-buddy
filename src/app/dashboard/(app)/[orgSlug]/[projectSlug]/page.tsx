import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getSession } from "@/lib/auth/helpers";
import { requireOrgMember } from "@/lib/auth/org-access";
import { prisma } from "@/lib/prisma";
import {
  getOrgFeedback,
  getOrgFeedbackStatsForProject,
} from "@/server/services/feedback.service";
import { getOrgProjectBySlug } from "@/server/services/projects.service";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Bug Buddy",
  description: "Overview of your feedback and analytics",
};

export default async function ProjectDashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string }>;
}) {
  const session = await getSession();
  const { orgSlug, projectSlug } = await params;

  if (!session?.user) {
    redirect("/signin");
  }

  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });
  if (!org) redirect("/dashboard");

  await requireOrgMember(org.id);

  const project = await getOrgProjectBySlug(org.id, projectSlug);
  if (!project) {
    redirect(`/dashboard/${orgSlug}`);
  }

  const latestFeedback = await getOrgFeedback({
    organizationId: org.id,
    projectId: project.id,
    limit: 4,
  });

  const stats = await getOrgFeedbackStatsForProject(org.id, project.id);

  const transformedFeedback = latestFeedback.map((f) => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
  }));

  return (
    <DashboardOverview
      latestFeedback={transformedFeedback}
      stats={stats}
      hasProjects={true}
      projectSlug={projectSlug}
    />
  );
}
