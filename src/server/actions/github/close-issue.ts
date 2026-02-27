"use server";

import { requireAuth } from "@/lib/auth/helpers";
import { hasMinRole } from "@/lib/auth/org-access";
import { closeGitHubIssue } from "@/lib/github";
import { prisma } from "@/lib/prisma";
import { closeIssueSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function closeIssue(data: z.infer<typeof closeIssueSchema>) {
  try {
    const session = await requireAuth();
    const validated = closeIssueSchema.parse(data);

    const issue = await prisma.issue.findUnique({
      where: { id: validated.issueId },
      include: {
        feedback: {
          include: {
            project: {
              include: {
                githubIntegration: true,
              },
            },
          },
        },
      },
    });

    if (!issue) {
      return { success: false, error: "Issue not found" };
    }

    const membership = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
        organizationId: issue.feedback.project.organizationId,
      },
    });

    if (!membership || !hasMinRole(membership.role, "admin")) {
      return { success: false, error: "Insufficient permissions" };
    }

    if (!issue.feedback.project.githubIntegration) {
      return { success: false, error: "GitHub integration not configured" };
    }

    await closeGitHubIssue(issue.feedback.projectId, issue.githubIssueId);

    const updatedIssue = await prisma.issue.update({
      where: { id: validated.issueId },
      data: { state: "closed", syncedAt: new Date() },
    });

    await prisma.feedback.update({
      where: { id: issue.feedbackId },
      data: { status: "closed" },
    });

    await prisma.issueActivity.create({
      data: {
        issueId: issue.id,
        type: "state_change",
        actor: session.user.email || null,
        content: "Issue closed",
        metadata: JSON.stringify({ state: "closed" }),
      },
    });

    revalidatePath(
      `/dashboard/${issue.feedback.project.slug}/feedback/${issue.feedbackId}`,
      "page",
    );
    revalidatePath(
      `/dashboard/${issue.feedback.project.slug}/feedback`,
      "layout",
    );

    return { success: true, issue: updatedIssue };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid request data",
        details: error.format().fieldErrors,
      };
    }

    console.error("Error closing GitHub issue:", error);
    return {
      success: false,
      error: "Failed to close issue",
      details: String(error),
    };
  }
}
