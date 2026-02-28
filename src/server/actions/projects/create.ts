"use server";

import { serverEnv } from "@/env";
import { requireOrgRole } from "@/lib/auth/org-access";
import { getInstallationAccessToken } from "@/lib/github-app-auth";
import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/schemas";
import { generateUniqueProjectSlug } from "@/server/services/project-slug.service";
import { Octokit } from "@octokit/rest";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/** Create a project. Requires org role admin or owner. */
export async function createProject(data: z.input<typeof createProjectSchema>) {
  try {
    const validated = createProjectSchema.parse(data);
    const { session } = await requireOrgRole(validated.organizationId, "admin");

    const [repositoryOwner, repositoryName] = validated.repository.split("/");
    if (!repositoryOwner || !repositoryName) {
      return {
        success: false,
        error: "Invalid repository format. Please use format: owner/repo",
      };
    }

    try {
      const installationToken = await getInstallationAccessToken(
        validated.installationId,
      );
      const octokit = new Octokit({ auth: installationToken });
      const { data: repo } = await octokit.rest.repos.get({
        owner: repositoryOwner,
        repo: repositoryName,
      });

      if (!repo.has_issues) {
        return {
          success: false,
          error: `Repository ${repositoryOwner}/${repositoryName} has issues disabled. Please enable issues in the repository settings.`,
        };
      }
    } catch (error) {
      const githubError = error as { status?: number; message?: string };
      if (githubError.status === 404) {
        return {
          success: false,
          error: `Repository ${repositoryOwner}/${repositoryName} not found or the GitHub App is not installed on it.`,
        };
      }
      if (githubError.status === 403) {
        return {
          success: false,
          error:
            "Access denied. The GitHub App does not have permission to access this repository. Ensure the app is installed and has Issues read/write permission.",
        };
      }
      throw error;
    }

    const apiKey = `bb_${randomBytes(32).toString("hex")}`;
    const secretKey = `bb_sk_${randomBytes(32).toString("hex")}`;
    const slug = await generateUniqueProjectSlug(validated.name);

    const project = await prisma.project.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description || null,
        allowedDomains: validated.allowedDomains,
        apiKey,
        secretKey,
        userId: session.user.id,
        organizationId: validated.organizationId,
      },
      include: {
        _count: {
          select: {
            feedback: true,
          },
        },
      },
    });

    await prisma.gitHubIntegration.create({
      data: {
        projectId: project.id,
        appId: serverEnv.GITHUB_APP_ID,
        installationId: validated.installationId,
        repositoryOwner,
        repositoryName,
        defaultLabels: validated.defaultLabels,
        defaultAssignees: validated.defaultAssignees,
      },
    });

    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/new", "page");

    return {
      success: true,
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
        description: project.description,
        apiKey: project.apiKey,
        createdAt: project.createdAt.toISOString(),
        _count: project._count,
        githubIntegration: {
          repositoryOwner,
          repositoryName,
        },
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid request data",
        details: error.format().fieldErrors,
      };
    }

    console.error("Error creating project:", error);
    return { success: false, error: "Internal server error" };
  }
}
