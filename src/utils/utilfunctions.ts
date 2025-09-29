// use a type-only import if your TS config requires it
import type { LoginResponse } from "../api/apiTypes";

export function getUserData(): LoginResponse | null {
  const raw = localStorage.getItem("userData");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LoginResponse;
  } catch (err) {
    console.warn("getUserData: invalid JSON stored in localStorage", err);
    return null;
  }
}
