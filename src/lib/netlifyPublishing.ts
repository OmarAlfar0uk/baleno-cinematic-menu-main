import type { Branch, MenuCategory, MenuItem, Settings } from "@/store/useStore";

export interface PublishedDraft {
  settings: Settings;
  branches: Branch[];
  currentBranchId: string;
  categories: MenuCategory[];
  items: MenuItem[];
}

export interface PublishingSession {
  authenticated: boolean;
  label: string | null;
  repo: string | null;
  branch: string | null;
}

const defaultSession: PublishingSession = {
  authenticated: false,
  label: null,
  repo: null,
  branch: null,
};

let cachedSession: PublishingSession = defaultSession;

async function requestJson<T>(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    credentials: "same-origin",
    headers,
  });

  const raw = await response.text();
  let data: unknown = null;

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { message: raw };
    }
  }

  if (!response.ok) {
    const message = typeof data === "object" && data && "message" in data
      ? String((data as { message: string }).message)
      : `Request failed with status ${response.status}.`;

    throw new Error(message);
  }

  return data as T;
}

function storeSession(session?: Partial<PublishingSession> | null) {
  cachedSession = {
    authenticated: session?.authenticated === true,
    label: typeof session?.label === "string" ? session.label : null,
    repo: typeof session?.repo === "string" ? session.repo : null,
    branch: typeof session?.branch === "string" ? session.branch : null,
  };

  return cachedSession;
}

export function getPublishingSession() {
  return cachedSession;
}

export async function refreshPublishingSession(listener?: (session: PublishingSession) => void) {
  try {
    const session = await requestJson<PublishingSession>("/api/admin/session", {
      method: "GET",
    });

    const nextSession = storeSession(session);
    listener?.(nextSession);
    return nextSession;
  } catch {
    const nextSession = storeSession(null);
    listener?.(nextSession);
    return nextSession;
  }
}

export async function fetchPublishedSiteDraft() {
  return requestJson<PublishedDraft>("/api/site-content", {
    method: "GET",
  });
}

export async function loginPublishingAdmin(password: string) {
  await requestJson("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });

  return refreshPublishingSession();
}

export async function logoutPublishingUser() {
  await requestJson("/api/admin/logout", {
    method: "POST",
  });

  return storeSession(null);
}

export async function publishSiteDraft(draft: PublishedDraft) {
  return requestJson<PublishedDraft & { repo?: string; branch?: string }>("/api/admin/publish", {
    method: "POST",
    body: JSON.stringify(draft),
  });
}

export const saveSiteDraft = publishSiteDraft;
