import type { Branch, MenuCategory, MenuItem, Settings } from "@/store/useStore";

declare global {
  interface Window {
    netlifyIdentity?: {
      currentUser: () => { email?: string } | null;
      init?: () => void;
      on: (event: string, cb: (user?: { email?: string } | null) => void) => void;
      open: (panel?: string) => void;
      close?: () => void;
      refresh: () => Promise<string>;
      logout: () => Promise<void> | void;
    };
  }
}

const GIT_GATEWAY_BASE = "/.netlify/git/github";
const REPO_BRANCH = "main";
const CONTENT_PATH = "src/content/site.json";
const MEDIA_DIR = "public/menu-images";

type RepositoryContent = {
  sha?: string;
  path?: string;
};

export interface PublishedDraft {
  settings: Settings;
  branches: Branch[];
  currentBranchId: string;
  categories: MenuCategory[];
  items: MenuItem[];
}

function getIdentity() {
  return window.netlifyIdentity;
}

export function getPublishingUserEmail() {
  return getIdentity()?.currentUser()?.email || null;
}

export function initPublishingIdentity(listener?: (email: string | null) => void) {
  const identity = getIdentity();
  if (!identity) return;

  const notify = () => listener?.(getPublishingUserEmail());
  identity.init?.();
  notify();
  identity.on("init", notify);
  identity.on("login", notify);
  identity.on("logout", notify);
}

export function openPublishingLogin() {
  const returnTo = `${window.location.origin}${window.location.pathname}?publishing_connected=1`;
  window.location.assign(`/admin/?connect=1&return_to=${encodeURIComponent(returnTo)}`);
}

export async function logoutPublishingUser() {
  const identity = getIdentity();
  if (!identity) return;
  await identity.logout();
}

async function getPublishingToken() {
  const identity = getIdentity();
  if (!identity?.currentUser()) {
    throw new Error("Please connect your publishing account first.");
  }

  return identity.refresh();
}

async function requestGitGateway<T>(path: string, init?: RequestInit) {
  const token = await getPublishingToken();
  const headers = new Headers(init?.headers);

  headers.set("Authorization", `Bearer ${token}`);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${GIT_GATEWAY_BASE}${path}`, {
    ...init,
    credentials: "same-origin",
    headers,
  });

  if (!response.ok) {
    const details = await response.text();
    const error = new Error(details || `Publishing failed with status ${response.status}`);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

async function getRepositoryContent(path: string) {
  try {
    return await requestGitGateway<RepositoryContent>(
      `/contents/${path}?ref=${REPO_BRANCH}`
    );
  } catch (error) {
    const typedError = error as Error & { status?: number };
    if (typedError.status === 404) {
      return null;
    }
    throw error;
  }
}

function toBase64Utf8(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function isDataUrlImage(value?: string) {
  return Boolean(value && value.startsWith("data:image/"));
}

function inferExtensionFromDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
  const mimeType = match?.[1] || "image/jpeg";

  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/gif") return "gif";
  if (mimeType === "image/bmp") return "bmp";
  if (mimeType === "image/avif") return "avif";
  if (mimeType === "image/heic") return "heic";
  if (mimeType === "image/heif") return "heif";
  if (mimeType === "image/svg+xml") return "svg";
  return "jpg";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function upsertRepositoryFile(path: string, contentBase64: string, message: string) {
  const existing = await getRepositoryContent(path);

  return requestGitGateway(
    `/contents/${path}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: contentBase64,
        branch: REPO_BRANCH,
        ...(existing?.sha ? { sha: existing.sha } : {}),
      }),
    }
  );
}

async function uploadItemImage(dataUrl: string, item: MenuItem) {
  const [, base64Payload = ""] = dataUrl.split(",");
  const extension = inferExtensionFromDataUrl(dataUrl);
  const itemSlug = slugify(item.name || item.nameAr || item.id || "menu-item") || "menu-item";
  const filename = `${itemSlug}-${item.id || Date.now().toString()}.${extension}`;

  await upsertRepositoryFile(
    `${MEDIA_DIR}/${filename}`,
    base64Payload,
    `Upload menu image for ${item.name || item.nameAr || item.id}`
  );

  return `/menu-images/${filename}`;
}

export async function publishSiteDraft(draft: PublishedDraft) {
  const normalizedItems: MenuItem[] = [];

  for (const item of draft.items) {
    if (isDataUrlImage(item.image)) {
      const imageUrl = await uploadItemImage(item.image!, item);
      normalizedItems.push({ ...item, image: imageUrl });
      continue;
    }

    normalizedItems.push(item);
  }

  const normalizedDraft: PublishedDraft = {
    settings: draft.settings,
    branches: draft.branches,
    currentBranchId: draft.currentBranchId,
    categories: draft.categories,
    items: normalizedItems,
  };

  const content = JSON.stringify(normalizedDraft, null, 2) + "\n";

  await upsertRepositoryFile(
    CONTENT_PATH,
    toBase64Utf8(content),
    `Update published menu content`
  );

  return normalizedDraft;
}
