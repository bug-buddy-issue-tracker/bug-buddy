const ROLE_HIERARCHY: Record<string, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

export function hasMinRole(
  memberRole: string,
  requiredRole: "owner" | "admin" | "member",
): boolean {
  const userLevel = ROLE_HIERARCHY[memberRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
  return userLevel >= requiredLevel;
}
