import { OrgSettingsClient } from "@/components/dashboard/org-settings-client";
import { getSession } from "@/lib/auth/helpers";
import { requireOrgMember } from "@/lib/auth/org-access";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Organization Settings | Bug Buddy",
  description: "Manage your organization members, invitations, and settings",
};

export default async function OrgSettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const session = await getSession();
  const { orgSlug } = await params;

  if (!session?.user) {
    redirect("/signin");
  }

  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });
  if (!org) redirect("/dashboard");

  const { member } = await requireOrgMember(org.id);

  const members = await prisma.member.findMany({
    where: { organizationId: org.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const invitations = await prisma.invitation.findMany({
    where: {
      organizationId: org.id,
      status: "pending",
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <OrgSettingsClient
      org={{ id: org.id, name: org.name, slug: org.slug }}
      currentUserRole={member.role}
      currentUserId={session.user.id}
      members={members.map((m) => ({
        id: m.id,
        role: m.role,
        createdAt: m.createdAt.toISOString(),
        user: m.user,
      }))}
      invitations={invitations.map((inv) => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        status: inv.status,
        expiresAt: inv.expiresAt.toISOString(),
        createdAt: inv.createdAt.toISOString(),
      }))}
    />
  );
}
