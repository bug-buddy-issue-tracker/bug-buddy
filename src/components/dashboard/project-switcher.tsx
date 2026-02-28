"use client";

import { ChevronsUpDown, Plus } from "lucide-react";

import { hasMinRole } from "@/lib/auth/role-utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useOrg } from "./org-context";
import { useProject } from "./project-context";

export function ProjectSwitcher({ className }: { className?: string }) {
  const { projects, currentProject, setCurrentProjectSlug, orgSlug } =
    useProject();
  const { activeOrg } = useOrg();

  const canCreateProject = hasMinRole(activeOrg.role, "admin");
  const newProjectHref = orgSlug
    ? `/dashboard/new?org=${encodeURIComponent(orgSlug)}`
    : "/dashboard/new";

  if (projects.length === 0) {
    return canCreateProject ? (
      <Button asChild variant="outline" className={cn("h-9", className)}>
        <Link href={newProjectHref}>
          <Plus className="size-4" />
          Create project
        </Link>
      </Button>
    ) : (
      <Button
        variant="outline"
        className={cn("h-9", className)}
        disabled
        title="Only admins and owners can create projects"
      >
        <span className="text-muted-foreground">No projects</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 gap-2 justify-between active:scale-100",
            className,
          )}
        >
          <span className="truncate">
            {currentProject?.name || "Select project"}
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[260px]">
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {projects.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onClick={() => setCurrentProjectSlug(p.slug)}
          >
            <span className="truncate">{p.name}</span>
          </DropdownMenuItem>
        ))}
        {canCreateProject && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={newProjectHref}>
                <Plus className="size-4" />
                Create project
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
