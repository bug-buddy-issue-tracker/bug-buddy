"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataPagination } from "@/components/ui/data-pagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllOrganizations } from "@/server/actions/admin.actions";
import { useQuery } from "@tanstack/react-query";
import { Building2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Organization = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: string;
  _count: {
    members: number;
    projects: number;
  };
  owner: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
};

type OrgsResponse = {
  organizations: Organization[];
  total: number;
};

export function AdminOrgsTable() {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const {
    data: orgsData,
    isLoading,
    error,
  } = useQuery<OrgsResponse>({
    queryKey: ["admin-orgs", limit, offset, searchValue],
    queryFn: () => getAllOrganizations({ limit, offset, search: searchValue }),
  });

  const organizations = orgsData?.organizations || [];
  const total = orgsData?.total || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search orgs by name or slug..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setOffset(0);
            }}
            className="w-[300px]"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {total} organizations
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-destructive"
                >
                  Error: {error.message}
                </TableCell>
              </TableRow>
            ) : organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No organizations found
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">{org.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {org.owner ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={org.owner.image || undefined} />
                          <AvatarFallback>
                            {org.owner.name?.[0]?.toUpperCase() ||
                              org.owner.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {org.owner.name || "No name"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {org.owner.email}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {org.slug}
                    </code>
                  </TableCell>
                  <TableCell>{org._count.members}</TableCell>
                  <TableCell>{org._count.projects}</TableCell>
                  <TableCell>
                    {new Date(org.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/${org.slug}/settings`}
                      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
                    >
                      <ExternalLink className="size-3" />
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total > 0 && (
        <DataPagination
          total={total}
          limit={limit}
          offset={offset}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setOffset(0);
          }}
          onOffsetChange={setOffset}
        />
      )}
    </div>
  );
}
