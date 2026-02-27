import { prisma } from "@/lib/prisma";
import { requireAuth } from "./helpers";
export { hasMinRole } from "./role-utils";

const ROLE_HIERARCHY: Record<string, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

export async function requireOrgMember(organizationId: string) {
  const session = await requireAuth();
  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId,
    },
  });

  if (!membership) {
    throw new Error("Not a member of this organization");
  }

  return { session, member: membership };
}

export async function requireOrgRole(
  organizationId: string,
  requiredRole: "owner" | "admin" | "member",
) {
  const { session, member } = await requireOrgMember(organizationId);
  const userLevel = ROLE_HIERARCHY[member.role] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;

  if (userLevel < requiredLevel) {
    throw new Error("Insufficient permissions");
  }

  return { session, member };
}

export async function getProjectWithOrgCheck(projectId: string) {
  const session = await requireAuth();
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      githubIntegration: true,
      widgetCustomization: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: project.organizationId,
    },
  });

  if (!membership) {
    throw new Error("Not a member of this organization");
  }

  return { session, project, member: membership };
}
