"use client";

import { CreateOrganizationDialog } from "@/components/dashboard/create-organization-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, ChevronRight, FolderKanban, Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export interface OrgForHome {
  id: string;
  name: string;
  slug: string;
  projectCount: number;
}

export function UserHomeContent({ orgs }: { orgs: OrgForHome[] }) {
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organizations</h1>
        <p className="text-muted-foreground">
          Choose an organization to view projects and feedback
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orgs.map((org) => (
          <Link
            key={org.id}
            href={`/dashboard/${org.slug}`}
            className="group block"
          >
            <Card className="transition-colors hover:border-primary/30 hover:bg-accent/30">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="size-5" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary">
                    {org.name}
                  </CardTitle>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="flex items-center gap-1.5">
                  <FolderKanban className="size-4" />
                  {org.projectCount === 0
                    ? "No projects"
                    : `${org.projectCount} project${org.projectCount === 1 ? "" : "s"}`}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}

        <button
          type="button"
          onClick={() => setCreateDialogOpen(true)}
          className="block text-left"
        >
          <Card className="border-dashed transition-colors hover:border-primary/40 hover:bg-accent/20">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
                <Plus className="size-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-base font-medium">
                Create organization
              </CardTitle>
              <CardDescription className="mt-1 text-center text-sm">
                Add a new organization to get started
              </CardDescription>
            </CardContent>
          </Card>
        </button>
      </div>

      <CreateOrganizationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={(orgSlug) => {
          window.location.href = `/dashboard/new?org=${encodeURIComponent(orgSlug)}`;
        }}
      />
    </div>
  );
}
