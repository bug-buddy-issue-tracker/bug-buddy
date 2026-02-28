"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderKanban, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";

export interface ProjectForOrgHome {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { feedback: number };
}

export function OrgHomeContent({
  orgSlug,
  orgName,
  projects,
  canCreateProject = true,
}: {
  orgSlug: string;
  orgName: string;
  projects: ProjectForOrgHome[];
  /** Whether the current user can create projects (admin or owner). Default true for backwards compat. */
  canCreateProject?: boolean;
}) {
  const newProjectHref = `/dashboard/new?org=${encodeURIComponent(orgSlug)}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{orgName}</h1>
        <p className="text-muted-foreground">Projects in this organization</p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <FolderKanban className="size-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">No projects yet</h2>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Create your first project to start collecting feedback with the
              Bug Buddy widget.
            </p>
            {canCreateProject && (
              <Button asChild>
                <Link href={newProjectHref}>
                  <Plus className="mr-2 size-4" />
                  Create project
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/${orgSlug}/${project.slug}`}
              className="group block"
            >
              <Card className="transition-colors hover:border-primary/30 hover:bg-accent/30">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FolderKanban className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="truncate text-lg group-hover:text-primary">
                        {project.name}
                      </CardTitle>
                      {project.description && (
                        <CardDescription className="mt-0.5 line-clamp-2">
                          {project.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MessageSquare className="size-4 shrink-0" />
                    {project._count.feedback === 0
                      ? "No feedback yet"
                      : `${project._count.feedback} feedback item${project._count.feedback === 1 ? "" : "s"}`}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {canCreateProject && (
            <Button
              asChild
              variant="outline"
              className="flex h-auto min-h-[120px] flex-col items-center justify-center gap-2 border-dashed py-6"
            >
              <Link href={newProjectHref}>
                <Plus className="size-8 text-muted-foreground" />
                <span>Create project</span>
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
