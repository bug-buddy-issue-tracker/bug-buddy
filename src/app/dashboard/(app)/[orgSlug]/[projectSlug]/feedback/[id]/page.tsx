import { FeedbackDetail } from "@/components/dashboard/feedback-detail";
import { getSession } from "@/lib/auth/helpers";
import { requireOrgMember } from "@/lib/auth/org-access";
import { prisma } from "@/lib/prisma";
import {
  getFeedbackById,
  getFeedbackMetadata,
} from "@/server/services/feedback.service";
import { getOrgProjectBySlug } from "@/server/services/projects.service";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string; id: string }>;
}): Promise<Metadata> {
  const session = await getSession();
  const { orgSlug, id } = await params;

  if (!session?.user) {
    return {
      title: "Feedback | Bug Buddy",
      description: "View feedback details",
    };
  }

  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });
  if (!org) {
    return {
      title: "Feedback | Bug Buddy",
      description: "View feedback details",
    };
  }

  const feedback = await getFeedbackMetadata(org.id, id);

  if (!feedback) {
    return {
      title: "Feedback | Bug Buddy",
      description: "View feedback details",
    };
  }

  return {
    title: `${feedback.title} | Bug Buddy`,
    description:
      feedback.description || `Feedback from ${feedback.project.name}`,
  };
}

export default async function ProjectFeedbackDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string; id: string }>;
}) {
  const session = await getSession();
  const { orgSlug, projectSlug, id } = await params;

  if (!session?.user) {
    notFound();
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

  const feedback = await getFeedbackById(org.id, id);

  if (!feedback || feedback.projectId !== project.id) {
    notFound();
  }

  const feedbackWithStringDates = {
    ...feedback,
    createdAt: feedback.createdAt.toISOString(),
    issue: feedback.issue
      ? {
          ...feedback.issue,
          activities: feedback.issue.activities.map((activity) => ({
            ...activity,
            createdAt: activity.createdAt.toISOString(),
          })),
        }
      : null,
    deviceInfo:
      typeof feedback.deviceInfo === "string"
        ? JSON.parse(feedback.deviceInfo)
        : feedback.deviceInfo,
  };

  return <FeedbackDetail feedback={feedbackWithStringDates} />;
}
