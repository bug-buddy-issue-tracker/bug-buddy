"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useOrg } from "./org-context";
import { useProject } from "./project-context";

const sectionLabels: Record<string, string> = {
  feedback: "Feedback",
  analytics: "Analytics",
  settings: "Settings",
  projects: "Projects",
  account: "Account",
  admin: "Admin",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const { currentProject, orgSlug } = useProject();
  const { activeOrg } = useOrg();

  const buildBreadcrumbs = () => {
    const items: Array<{ label: string; href?: string }> = [];
    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] !== "dashboard") return items;

    items.push({ label: "Dashboard", href: "/dashboard" });

    if (pathname === "/dashboard") return items;

    const second = segments[1];
    const globalSections = ["account", "admin", "new"];

    if (second && globalSections.includes(second)) {
      for (let i = 1; i < segments.length; i++) {
        const segment = segments[i]!;
        const isLast = i === segments.length - 1;
        const label = sectionLabels[segment] || segment;
        const href = !isLast
          ? `/${segments.slice(0, i + 1).join("/")}`
          : undefined;
        items.push({ label, href });
      }
      return items;
    }

    // Org-scoped: /dashboard/<orgSlug>/...
    if (second) {
      const third = segments[2]; // projectSlug or "settings"

      if (third === "settings") {
        items.push({
          label: activeOrg.name,
          href: `/dashboard/${second}`,
        });
        items.push({ label: "Settings" });
        return items;
      }

      if (third) {
        items.push({
          label: currentProject?.name || third,
          href: `/dashboard/${second}/${third}`,
        });

        for (let i = 3; i < segments.length; i++) {
          const segment = segments[i]!;
          const isLast = i === segments.length - 1;
          const label =
            sectionLabels[segment] ||
            (/^[a-zA-Z0-9_-]+$/.test(segment) && segment.length > 20
              ? `${segment.substring(0, 20)}...`
              : segment
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "));

          const href = (() => {
            if (segment === "feedback")
              return `/dashboard/${second}/${third}/feedback`;
            if (segment === "analytics")
              return `/dashboard/${second}/${third}/analytics`;
            if (segment === "settings")
              return `/dashboard/${second}/${third}/settings`;
            return undefined;
          })();

          items.push({ label, href: !isLast ? href : undefined });
        }
      }
    }

    return items;
  };

  const breadcrumbs = buildBreadcrumbs();

  return (
    <Breadcrumb className="hidden md:block w-full">
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <React.Fragment key={item.href || item.label}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href || "#"}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
