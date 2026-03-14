import { AUTH_CURRENT_USER_KEY, AUTH_USERS_KEY } from "../constants";
import type { StoredUser } from "../types";

export const getStoredUsers = (): StoredUser[] => {
  const raw = localStorage.getItem(AUTH_USERS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveStoredUsers = (users: StoredUser[]): void => {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): string => localStorage.getItem(AUTH_CURRENT_USER_KEY) || "";

export const setCurrentUser = (fullName: string): void => {
  localStorage.setItem(AUTH_CURRENT_USER_KEY, fullName);
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(AUTH_CURRENT_USER_KEY);
};
