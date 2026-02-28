import { ProjectScopedSettingsForm } from "@/components/dashboard/project-scoped-settings-form";
import { getSession } from "@/lib/auth/helpers";
import { requireOrgMember } from "@/lib/auth/org-access";
import { prisma } from "@/lib/prisma";
import { getOrgProjectBySlug } from "@/server/services/projects.service";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings | Bug Buddy",
  description:
    "Configure your project settings, GitHub integration, and widget customization",
};

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string }>;
}) {
  const session = await getSession();
  const { orgSlug, projectSlug } = await params;

  if (!session?.user) {
    redirect("/signin");
  }

  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });
  if (!org) redirect("/dashboard");

  const { member } = await requireOrgMember(org.id);

  const project = await getOrgProjectBySlug(org.id, projectSlug);
  if (!project) {
    redirect(`/dashboard/${orgSlug}`);
  }

  return (
    <ProjectScopedSettingsForm
      project={{
        id: project.id,
        name: project.name,
        apiKey: project.apiKey,
        secretKey: project.secretKey,
        allowedDomains: project.allowedDomains,
        githubIntegration: project.githubIntegration
          ? {
              id: project.githubIntegration.id,
              repositoryOwner: project.githubIntegration.repositoryOwner,
              repositoryName: project.githubIntegration.repositoryName,
              defaultLabels: project.githubIntegration.defaultLabels,
              defaultAssignees: project.githubIntegration.defaultAssignees,
              installationId: project.githubIntegration.installationId,
            }
          : null,
        widgetCustomization: project.widgetCustomization
          ? {
              id: project.widgetCustomization.id,
              primaryColor: project.widgetCustomization.primaryColor,
              secondaryColor: project.widgetCustomization.secondaryColor,
              fontFamily: project.widgetCustomization.fontFamily,
              fontUrl: project.widgetCustomization.fontUrl,
              fontFileName: project.widgetCustomization.fontFileName,
              borderRadius: project.widgetCustomization.borderRadius,
              buttonText: project.widgetCustomization.buttonText,
              buttonPosition: project.widgetCustomization.buttonPosition,
            }
          : null,
      }}
      memberRole={member.role}
    />
  );
}
