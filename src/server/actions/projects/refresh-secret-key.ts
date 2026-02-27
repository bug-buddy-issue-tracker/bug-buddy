"use server";

import { getProjectWithOrgCheck, hasMinRole } from "@/lib/auth/org-access";
import { prisma } from "@/lib/prisma";
import { refreshApiKeySchema } from "@/lib/schemas";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function refreshSecretKey(
  data: z.infer<typeof refreshApiKeySchema>,
) {
  try {
    const validated = refreshApiKeySchema.parse(data);
    const { project, member } = await getProjectWithOrgCheck(
      validated.projectId,
    );

    if (!hasMinRole(member.role, "owner")) {
      return {
        success: false,
        error: "Only the organization owner can refresh secret keys",
      };
    }

    const newSecretKey = `bb_sk_${randomBytes(32).toString("hex")}`;

    const updatedProject = await prisma.project.update({
      where: { id: validated.projectId },
      data: { secretKey: newSecretKey },
    });

    revalidatePath(`/dashboard/${project.slug}/settings`, "page");

    return { success: true, secretKey: updatedProject.secretKey };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid request data",
        details: error.format().fieldErrors,
      };
    }

    console.error("Error refreshing secret key:", error);
    return { success: false, error: "Internal server error" };
  }
}
