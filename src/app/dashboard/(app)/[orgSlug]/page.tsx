import { OrgHomeContent } from "@/components/dashboard/org-home-content";
import { hasMinRole } from "@/lib/auth/role-utils";
import { requireOrgMember } from "@/lib/auth/org-access";
import { prisma } from "@/lib/prisma";
import { getOrgProjects } from "@/server/services/projects.service";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Projects | Bug Buddy",
  description: "Projects in this organization",
};

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
    select: { id: true, name: true, slug: true },
  });

  if (!org) {
    redirect("/dashboard");
  }

  const { member } = await requireOrgMember(org.id);

  const projects = await getOrgProjects(org.id);

  const projectsForHome = projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    _count: { feedback: p._count.feedback },
  }));

  const canCreateProject = hasMinRole(member.role, "admin");

  return (
    <OrgHomeContent
      orgSlug={org.slug}
      orgName={org.name}
      projects={projectsForHome}
      canCreateProject={canCreateProject}
    />
  );
}
