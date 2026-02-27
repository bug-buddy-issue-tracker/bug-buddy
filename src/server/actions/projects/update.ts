"use server";

import { getProjectWithOrgCheck, hasMinRole } from "@/lib/auth/org-access";
import { prisma } from "@/lib/prisma";
import { updateProjectSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateProject(data: z.infer<typeof updateProjectSchema>) {
  try {
    const validated = updateProjectSchema.parse(data);
    const { project, member } = await getProjectWithOrgCheck(
      validated.projectId,
    );

    if (!hasMinRole(member.role, "admin")) {
      return { success: false, error: "Insufficient permissions" };
    }

    await prisma.project.update({
      where: { id: validated.projectId },
      data: {
        name: validated.name,
        ...(validated.allowedDomains !== undefined && {
          allowedDomains: validated.allowedDomains,
        }),
      },
    });

    revalidatePath(`/dashboard/${project.slug}/settings`, "page");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid request data",
        details: error.format().fieldErrors,
      };
    }

    console.error("Error updating project:", error);
    return { success: false, error: "Internal server error" };
  }
}
