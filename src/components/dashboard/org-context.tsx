"use client";

import * as React from "react";

export type OrgForSwitcher = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  role: string;
};

type OrgContextValue = {
  orgs: OrgForSwitcher[];
  activeOrg: OrgForSwitcher;
};

const OrgContext = React.createContext<OrgContextValue | null>(null);

export function OrgProvider({
  orgs,
  activeOrg,
  children,
}: {
  orgs: OrgForSwitcher[];
  activeOrg: OrgForSwitcher;
  children: React.ReactNode;
}) {
  const value = React.useMemo(() => ({ orgs, activeOrg }), [orgs, activeOrg]);

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  const ctx = React.useContext(OrgContext);
  if (!ctx) {
    throw new Error("useOrg must be used within an OrgProvider");
  }
  return ctx;
}
