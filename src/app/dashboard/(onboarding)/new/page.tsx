import { CreateProjectPageClient } from "@/components/dashboard/create-project-page-client";
import { OnboardingOrgCreate } from "@/components/dashboard/onboarding-org-create";
import { OrgProvider } from "@/components/dashboard/org-context";
import { getSession } from "@/lib/auth/helpers";
import { hasMinRole } from "@/lib/auth/role-utils";
import { prisma } from "@/lib/prisma";
import { getInstallationRepositories } from "@/server/actions/github/app/installation-repositories";
import { getOrgDefaultGitHubAppInstallationId } from "@/server/actions/github/app/user-installation";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create project | Bug Buddy",
  description: "Create your first Bug Buddy project",
};

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ installation_id?: string; org?: string }>;
}) {
  const session = await getSession();
  const sp = await searchParams;

  if (!session?.user) {
    redirect("/signin");
  }

  const memberships = await prisma.member.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  if (memberships.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-background rounded-lg p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold">Create your organization</h1>
          <p className="text-muted-foreground">
            Create an organization first, then you can add projects to it.
          </p>
        </div>
        <OnboardingOrgCreate />
      </div>
    );
  }

  const allOrgs = memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
    logo: m.organization.logo,
    role: m.role,
  }));

  // Only admins and owners can create projects; show only orgs where they have that role
  const orgs = allOrgs.filter((o) => hasMinRole(o.role, "admin"));

  if (orgs.length === 0) {
    redirect("/dashboard");
  }

  const orgSlugFromUrl = sp.org?.trim();
  const activeOrg =
    (orgSlugFromUrl && orgs.find((o) => o.slug === orgSlugFromUrl)) || orgs[0]!;

  const installationIdFromUrl = sp.installation_id || "";
  const orgDefault = await getOrgDefaultGitHubAppInstallationId(activeOrg.id);

  const installationId =
    installationIdFromUrl || orgDefault.installationId || "";

  const reposResult = installationId
    ? await getInstallationRepositories({ installationId })
    : null;

  const cancelHref = activeOrg ? `/dashboard/${activeOrg.slug}` : "/dashboard";

  return (
    <OrgProvider orgs={orgs} activeOrg={activeOrg}>
      <div className="max-w-2xl mx-auto bg-background rounded-lg p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold">Create a project</h1>
          <p className="text-muted-foreground">
            Create a project in <strong>{activeOrg.name}</strong> to start
            collecting feedback.
          </p>
        </div>

        <CreateProjectPageClient
          initialInstallationId={installationId}
          repositories={reposResult?.success ? reposResult.repositories : []}
          repoError={
            reposResult && !reposResult.success ? reposResult.error : null
          }
          cancelHref={cancelHref}
        />
      </div>
    </OrgProvider>
  );
}
