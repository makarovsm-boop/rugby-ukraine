import { redirect } from "next/navigation";

export function getFormErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  try {
    return decodeURIComponent(error);
  } catch {
    return error;
  }
}

export function getFormSuccessMessage(success?: string) {
  if (!success) {
    return null;
  }

  try {
    return decodeURIComponent(success);
  } catch {
    return success;
  }
}

export function redirectWithFormError(path: string, message: string): never {
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}error=${encodeURIComponent(message)}`);
}

export function redirectWithFormSuccess(path: string, message: string): never {
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}success=${encodeURIComponent(message)}`);
}
