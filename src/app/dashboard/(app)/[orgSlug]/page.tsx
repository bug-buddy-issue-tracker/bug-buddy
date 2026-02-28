import { requireOrgMember } from "@/lib/auth/org-access";
import { prisma } from "@/lib/prisma";
import { getOrgProjectsForSwitcher } from "@/server/services/projects.service";
import { redirect } from "next/navigation";

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
    select: { id: true, slug: true },
  });

  if (!org) {
    redirect("/dashboard");
  }

  await requireOrgMember(org.id);

  const projects = await getOrgProjectsForSwitcher(org.id);

  if (projects.length === 0) {
    redirect(`/dashboard/new?org=${encodeURIComponent(orgSlug)}`);
  }

  redirect(`/dashboard/${orgSlug}/${projects[0]!.slug}`);
}
