import { FeedbackListScoped } from "@/components/dashboard/feedback-list-scoped";
import { getSession } from "@/lib/auth/helpers";
import { requireOrgMember } from "@/lib/auth/org-access";
import { prisma } from "@/lib/prisma";
import { getOrgFeedback } from "@/server/services/feedback.service";
import { getOrgProjectBySlug } from "@/server/services/projects.service";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Feedback | Bug Buddy",
  description: "View and manage feedback submissions for your project",
};

interface ProjectFeedbackPageProps {
  params: Promise<{ orgSlug: string; projectSlug: string }>;
  searchParams: Promise<{
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    title?: string;
  }>;
}

export default async function ProjectFeedbackPage({
  params,
  searchParams,
}: ProjectFeedbackPageProps) {
  const session = await getSession();
  const { orgSlug, projectSlug } = await params;
  const sp = await searchParams;

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

  const feedback = await getOrgFeedback({
    organizationId: org.id,
    projectId: project.id,
    status: sp.status,
    title: sp.title,
    sortBy: sp.sortBy,
    sortOrder: sp.sortOrder,
  });

  const transformedFeedback = feedback.map((f) => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feedback</h1>
        <p className="text-muted-foreground">
          View and manage feedback submissions
        </p>
      </div>
      <FeedbackListScoped
        projectSlug={projectSlug}
        initialFeedback={transformedFeedback}
      />
    </div>
  );
}
