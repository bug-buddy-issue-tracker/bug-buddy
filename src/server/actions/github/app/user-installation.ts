"use server";

import { requireAuth } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";

/**
 * Returns a default GitHub App installationId for the organization, if any.
 * Uses any project in the org that has the app installed (e.g. installed by owner),
 * so admins can reuse the same installation when creating new projects.
 */
export async function getOrgDefaultGitHubAppInstallationId(
  organizationId: string,
) {
  await requireAuth();

  const integration = await prisma.gitHubIntegration.findFirst({
    where: {
      installationId: { not: null },
      project: { organizationId },
    },
    orderBy: { updatedAt: "desc" },
    select: { installationId: true },
  });

  return {
    success: true as const,
    installationId: integration?.installationId || null,
  };
}

/**
 * Returns a "default" GitHub App installationId for the current user, if any.
 * Prefer getOrgDefaultGitHubAppInstallationId(orgId) when creating a project in a specific org.
 */
export async function getUserDefaultGitHubAppInstallationId() {
  const session = await requireAuth();

  const integration = await prisma.gitHubIntegration.findFirst({
    where: {
      installationId: { not: null },
      project: { userId: session.user.id },
    },
    orderBy: { updatedAt: "desc" },
    select: { installationId: true },
  });

  return {
    success: true as const,
    installationId: integration?.installationId || null,
  };
}
