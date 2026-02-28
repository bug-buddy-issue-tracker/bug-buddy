"use client";

import { Building2, ChevronsUpDown, Plus, Settings } from "lucide-react";
import * as React from "react";

import { CreateOrganizationDialog } from "@/components/dashboard/create-organization-dialog";
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
import { useRouter } from "next/navigation";
import { useOrg } from "./org-context";

export function OrgSwitcher({ className }: { className?: string }) {
  const { orgs, activeOrg } = useOrg();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-9 gap-2 justify-between active:scale-100",
              className,
            )}
          >
            <Building2 className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{activeOrg.name}</span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[240px]">
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {orgs.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => router.push(`/dashboard/${org.slug}`)}
            >
              <Building2 className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{org.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            Create organization
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/${activeOrg.slug}/settings`)}
          >
            <Settings className="size-4" />
            Organization settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateOrganizationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={(orgSlug) => {
          router.push(`/dashboard/new?org=${encodeURIComponent(orgSlug)}`);
          router.refresh();
        }}
      />
    </>
  );
}
