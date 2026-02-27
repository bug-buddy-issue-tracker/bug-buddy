import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";
import { getSession } from "@/lib/auth/helpers";
import { requireOrgMember } from "@/lib/auth/org-access";
import { prisma } from "@/lib/prisma";
import { getOrgFeedbackForAnalytics } from "@/server/services/analytics.service";
import { getOrgProjectBySlug } from "@/server/services/projects.service";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Analytics | Bug Buddy",
  description:
    "View analytics and insights about your feedback and bug reports",
};

export default async function ProjectAnalyticsPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string }>;
}) {
  const session = await getSession();
  const { orgSlug, projectSlug } = await params;

  if (!session?.user) {
    redirect("/");
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

  const feedback = await getOrgFeedbackForAnalytics(org.id, project.id);

  const transformedFeedback = feedback.map((f) => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
  }));

  return <AnalyticsDashboard feedback={transformedFeedback} />;
}
