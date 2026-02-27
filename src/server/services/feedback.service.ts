import { prisma } from "@/lib/prisma";
import type { FeedbackWhereInput } from "@/server/prisma/generated/prisma/models";

interface GetFeedbackOptions {
  organizationId: string;
  projectId?: string;
  status?: string;
  title?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
}

export async function getOrgFeedback(options: GetFeedbackOptions) {
  const {
    organizationId,
    projectId,
    status,
    title,
    sortBy = "createdAt",
    sortOrder = "desc",
    limit,
  } = options;

  const where: FeedbackWhereInput = {
    project: {
      organizationId,
    },
  };

  if (projectId && projectId !== "all") {
    where.projectId = projectId;
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (title) {
    where.OR = [
      { title: { contains: title, mode: "insensitive" } },
      { description: { contains: title, mode: "insensitive" } },
    ];
  }

  let orderBy:
    | { createdAt?: "asc" | "desc" }
    | { title?: "asc" | "desc" }
    | { status?: "asc" | "desc" }
    | { project: { name: "asc" | "desc" } };
  if (sortBy === "project") {
    orderBy = { project: { name: sortOrder } };
  } else if (sortBy === "title") {
    orderBy = { title: sortOrder };
  } else if (sortBy === "status") {
    orderBy = { status: sortOrder };
  } else {
    orderBy = { createdAt: sortOrder };
  }

  return prisma.feedback.findMany({
    where,
    include: {
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      issue: {
        select: {
          id: true,
          githubIssueId: true,
          githubIssueUrl: true,
          state: true,
        },
      },
    },
    orderBy,
    ...(limit && { take: limit }),
  });
}

export async function getOrgFeedbackForAnalytics(
  organizationId: string,
  projectId?: string,
) {
  return prisma.feedback.findMany({
    where: {
      project: {
        organizationId,
      },
      ...(projectId ? { projectId } : {}),
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      issue: {
        select: {
          state: true,
          commentsCount: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getFeedbackById(
  organizationId: string,
  feedbackId: string,
) {
  return prisma.feedback.findFirst({
    where: {
      id: feedbackId,
      project: {
        organizationId,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      issue: {
        include: {
          activities: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });
}

export async function getFeedbackMetadata(
  organizationId: string,
  feedbackId: string,
) {
  return prisma.feedback.findFirst({
    where: {
      id: feedbackId,
      project: {
        organizationId,
      },
    },
    select: {
      title: true,
      description: true,
      project: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
}

export async function getOrgFeedbackStats(organizationId: string) {
  const [total, open, inProgress, closed] = await Promise.all([
    prisma.feedback.count({
      where: { project: { organizationId } },
    }),
    prisma.feedback.count({
      where: { project: { organizationId }, status: "open" },
    }),
    prisma.feedback.count({
      where: { project: { organizationId }, status: "in-progress" },
    }),
    prisma.feedback.count({
      where: { project: { organizationId }, status: "closed" },
    }),
  ]);

  return { total, open, inProgress, closed };
}

export async function getOrgFeedbackStatsForProject(
  organizationId: string,
  projectId: string,
) {
  const [total, open, inProgress, closed] = await Promise.all([
    prisma.feedback.count({
      where: { project: { organizationId }, projectId },
    }),
    prisma.feedback.count({
      where: { project: { organizationId }, projectId, status: "open" },
    }),
    prisma.feedback.count({
      where: {
        project: { organizationId },
        projectId,
        status: "in-progress",
      },
    }),
    prisma.feedback.count({
      where: { project: { organizationId }, projectId, status: "closed" },
    }),
  ]);

  return { total, open, inProgress, closed };
}
