import { requireConfig } from "./config.js";
import { httpError } from "./http.js";

const CONTENT_PATH = "src/content/site.json";
const MEDIA_DIR = "public/menu-images";
const USER_AGENT = "baleno-vercel-admin";

function encodePath(path) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function requestGitHub(path, init = {}) {
  const config = requireConfig(["githubToken", "repoOwner", "repoName"]);
  const headers = new Headers(init.headers || {});

  headers.set("Accept", "application/vnd.github+json");
  headers.set("Authorization", `Bearer ${config.githubToken}`);
  headers.set("User-Agent", USER_AGENT);
  headers.set("X-GitHub-Api-Version", "2022-11-28");

  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers,
  });

  const raw = await response.text();
  const data = raw ? safeParseJson(raw) : null;

  if (!response.ok) {
    throw httpError(response.status, data?.message || raw || `GitHub request failed (${response.status}).`);
  }

  return data;
}

async function getRepositoryContent(path) {
  const { repoOwner, repoName, repoBranch } = requireConfig(["githubToken", "repoOwner", "repoName"]);

  try {
    return await requestGitHub(
      `/repos/${encodeURIComponent(repoOwner)}/${encodeURIComponent(repoName)}/contents/${encodePath(path)}?ref=${encodeURIComponent(repoBranch)}`
    );
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status === 404) {
      return null;
    }

    throw error;
  }
}

async function upsertRepositoryFile(path, contentBase64, message) {
  const { repoOwner, repoName, repoBranch } = requireConfig(["githubToken", "repoOwner", "repoName"]);
  const existing = await getRepositoryContent(path);

  return requestGitHub(
    `/repos/${encodeURIComponent(repoOwner)}/${encodeURIComponent(repoName)}/contents/${encodePath(path)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        message,
        content: contentBase64,
        branch: repoBranch,
        ...(existing?.sha ? { sha: existing.sha } : {}),
      }),
    }
  );
}

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function sanitizeNumber(value, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function sanitizeBoolean(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function sanitizeSettings(value) {
  const input = isPlainObject(value) ? value : {};

  return {
    restaurantName: sanitizeString(input.restaurantName, "Baleno"),
    whatsappNumber: sanitizeString(input.whatsappNumber, ""),
    heroTagline: sanitizeString(input.heroTagline, ""),
    currency: sanitizeString(input.currency, "EGP"),
    openingHours: sanitizeString(input.openingHours, ""),
  };
}

function sanitizeBranches(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((branch) => isPlainObject(branch))
    .map((branch) => ({
      id: sanitizeString(branch.id),
      name: sanitizeString(branch.name),
      whatsappNumber: sanitizeString(branch.whatsappNumber),
      address: sanitizeString(branch.address),
      isActive: sanitizeBoolean(branch.isActive, true),
    }))
    .filter((branch) => branch.id && branch.name);
}

function sanitizeCategories(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((category) => isPlainObject(category))
    .map((category) => ({
      id: sanitizeString(category.id),
      label: sanitizeString(category.label),
      labelAr: sanitizeString(category.labelAr),
      icon: sanitizeString(category.icon),
    }))
    .filter((category) => category.id && category.label);
}

function sanitizeItems(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => isPlainObject(item))
    .map((item) => ({
      id: sanitizeString(item.id),
      name: sanitizeString(item.name),
      nameAr: sanitizeString(item.nameAr),
      description: sanitizeString(item.description),
      descriptionAr: sanitizeString(item.descriptionAr),
      price: sanitizeNumber(item.price, 0),
      image: sanitizeString(item.image),
      bestSeller: sanitizeBoolean(item.bestSeller, false),
      available: sanitizeBoolean(item.available, true),
      categoryId: sanitizeString(item.categoryId),
    }))
    .filter((item) => item.id && item.name && item.nameAr && item.categoryId);
}

function sanitizeDraft(input) {
  if (!isPlainObject(input)) {
    throw httpError(400, "Publish payload is invalid.");
  }

  const settings = sanitizeSettings(input.settings);
  const branches = sanitizeBranches(input.branches);
  const categories = sanitizeCategories(input.categories);
  const items = sanitizeItems(input.items);
  const currentBranchId = sanitizeString(input.currentBranchId, branches[0]?.id || "");

  return {
    settings,
    branches,
    currentBranchId,
    categories,
    items,
  };
}

function isDataUrlImage(value = "") {
  return value.startsWith("data:image/");
}

function inferExtensionFromDataUrl(dataUrl) {
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

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadItemImage(dataUrl, item) {
  const [, base64Payload = ""] = dataUrl.split(",");
  const extension = inferExtensionFromDataUrl(dataUrl);
  const itemSlug = slugify(item.name || item.nameAr || item.id || "menu-item") || "menu-item";
  const filename = `${itemSlug}-${item.id || Date.now().toString()}.${extension}`;

  await upsertRepositoryFile(
    `${MEDIA_DIR}/${filename}`,
    base64Payload,
    `Admin publish: upload image for ${item.name || item.nameAr || item.id}`
  );

  return `/menu-images/${filename}`;
}

export async function publishSiteDraft(input) {
  const config = requireConfig(["githubToken", "repoOwner", "repoName"]);
  const draft = sanitizeDraft(input);
  const normalizedItems = [];

  for (const item of draft.items) {
    if (isDataUrlImage(item.image)) {
      const imageUrl = await uploadItemImage(item.image, item);
      normalizedItems.push({ ...item, image: imageUrl });
      continue;
    }

    normalizedItems.push(item);
  }

  const normalizedDraft = {
    settings: draft.settings,
    branches: draft.branches,
    currentBranchId: draft.currentBranchId,
    categories: draft.categories,
    items: normalizedItems,
  };

  const content = JSON.stringify(normalizedDraft, null, 2) + "\n";

  await upsertRepositoryFile(
    CONTENT_PATH,
    Buffer.from(content, "utf8").toString("base64"),
    "Admin publish: update menu content"
  );

  return {
    ...normalizedDraft,
    repo: `${config.repoOwner}/${config.repoName}`,
    branch: config.repoBranch,
  };
}
