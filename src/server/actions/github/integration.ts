/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getProjectWithOrgCheck, hasMinRole } from "@/lib/auth/org-access";
import { prisma } from "@/lib/prisma";
import { githubIntegrationSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function saveGitHubIntegration(
  data: z.infer<typeof githubIntegrationSchema>,
) {
  try {
    const validated = githubIntegrationSchema.parse(data);
    const { project, member } = await getProjectWithOrgCheck(
      validated.projectId,
    );

    if (!hasMinRole(member.role, "owner")) {
      return {
        success: false,
        error: "Only the organization owner can change GitHub integration",
      };
    }

    const integration = await prisma.gitHubIntegration.upsert({
      where: { projectId: validated.projectId },
      update: {
        repositoryOwner: validated.repositoryOwner,
        repositoryName: validated.repositoryName,
        defaultLabels: validated.defaultLabels || [],
        defaultAssignees: validated.defaultAssignees || [],
      },
      create: {
        projectId: validated.projectId,
        repositoryOwner: validated.repositoryOwner,
        repositoryName: validated.repositoryName,
        defaultLabels: validated.defaultLabels || [],
        defaultAssignees: validated.defaultAssignees || [],
      },
    });

    revalidatePath(`/dashboard/${project.slug}/settings`, "page");
    return { success: true, integration };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid request data",
        details: error.format().fieldErrors,
      };
    }

    console.error("Error saving GitHub integration:", error);
    return { success: false, error: "Internal server error" };
  }
}
