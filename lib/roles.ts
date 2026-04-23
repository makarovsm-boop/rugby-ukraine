export const appRoles = ["USER", "EDITOR", "ADMIN"] as const;

export type AppRole = (typeof appRoles)[number];

export function isAppRole(value: string): value is AppRole {
  return appRoles.includes(value as AppRole);
}

export function normalizeRole(value?: string | null): AppRole {
  if (!value) {
    return "USER";
  }

  const normalized = value.toUpperCase();

  return isAppRole(normalized) ? normalized : "USER";
}

export function canAccessAdminPanel(role?: string | null) {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === "ADMIN" || normalizedRole === "EDITOR";
}

export function canAccessAdminPath(role: string | null | undefined, pathname: string) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "ADMIN") {
    return pathname.startsWith("/admin");
  }

  if (normalizedRole === "EDITOR") {
    return (
      pathname === "/admin/articles" ||
      pathname.startsWith("/admin/articles/") ||
      pathname === "/admin/comments" ||
      pathname.startsWith("/admin/comments/")
    );
  }

  return false;
}

export function isAdminRole(role?: string | null) {
  return normalizeRole(role) === "ADMIN";
}

export function isEditorRole(role?: string | null) {
  return normalizeRole(role) === "EDITOR";
}

export function getDefaultAdminHref(role?: string | null) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "ADMIN") {
    return "/admin";
  }

  if (normalizedRole === "EDITOR") {
    return "/admin/articles";
  }

  return "/";
}

export function getRoleLabel(role?: string | null) {
  switch (normalizeRole(role)) {
    case "ADMIN":
      return "ADMIN";
    case "EDITOR":
      return "EDITOR";
    case "USER":
    default:
      return "USER";
  }
}
