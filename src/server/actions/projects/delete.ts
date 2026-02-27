"use server";

import { getProjectWithOrgCheck, hasMinRole } from "@/lib/auth/org-access";
import { prisma } from "@/lib/prisma";
import { deleteProjectSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function deleteProject(data: z.infer<typeof deleteProjectSchema>) {
  try {
    const validated = deleteProjectSchema.parse(data);
    const { member } = await getProjectWithOrgCheck(validated.projectId);

    if (!hasMinRole(member.role, "owner")) {
      return {
        success: false,
        error: "Only the organization owner can delete projects",
      };
    }

    await prisma.project.delete({
      where: { id: validated.projectId },
    });

    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/new", "page");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid request data",
        details: error.format().fieldErrors,
      };
    }

    console.error("Error deleting project:", error);
    return { success: false, error: "Internal server error" };
  }
}
