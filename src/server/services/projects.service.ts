import { prisma } from "@/lib/prisma";

export async function getOrgProjects(organizationId: string) {
  return prisma.project.findMany({
    where: { organizationId },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      apiKey: true,
      secretKey: true,
      createdAt: true,
      _count: {
        select: {
          feedback: true,
        },
      },
      githubIntegration: {
        select: {
          repositoryOwner: true,
          repositoryName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrgProjectsWithIntegrations(organizationId: string) {
  return prisma.project.findMany({
    where: { organizationId },
    include: {
      githubIntegration: true,
      widgetCustomization: true,
    },
  });
}

export async function getOrgProjectsBasic(organizationId: string) {
  return prisma.project.findMany({
    where: { organizationId },
    select: { id: true, name: true },
  });
}

export async function getOrgProjectsForSwitcher(organizationId: string) {
  return prisma.project.findMany({
    where: { organizationId },
    select: { id: true, name: true, slug: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrgProjectBySlug(
  organizationId: string,
  slug: string,
) {
  return prisma.project.findFirst({
    where: { organizationId, slug },
    include: {
      githubIntegration: true,
      widgetCustomization: true,
      _count: { select: { feedback: true } },
    },
  });
}

export async function getOrgProjectCount(organizationId: string) {
  return prisma.project.count({
    where: { organizationId },
  });
}

export async function getProjectByApiKey(apiKey: string) {
  return prisma.project.findUnique({
    where: { apiKey },
    include: {
      widgetCustomization: true,
      githubIntegration: true,
    },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      widgetCustomization: true,
      githubIntegration: true,
    },
  });
}
