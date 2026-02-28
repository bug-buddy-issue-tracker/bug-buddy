import { UserHomeContent } from "@/components/dashboard/user-home-content";
import { getSession } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Bug Buddy",
  description: "Your organizations and projects",
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin");
  }

  const memberships = await prisma.member.findMany({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          _count: { select: { projects: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (memberships.length === 0) {
    redirect("/dashboard/new");
  }

  const orgs = memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
    projectCount: m.organization._count.projects,
  }));

  return <UserHomeContent orgs={orgs} />;
}
