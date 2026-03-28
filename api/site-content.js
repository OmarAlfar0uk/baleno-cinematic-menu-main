import { requireConfig } from "./_lib/config.js";
import { json, methodNotAllowed, noStore } from "./_lib/http.js";

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function requestGitHub(path) {
  const { githubToken, repoOwner, repoName } = requireConfig(["githubToken", "repoOwner", "repoName"]);

  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubToken}`,
      "User-Agent": "baleno-live-content",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const raw = await response.text();
  const data = raw ? safeParseJson(raw) : null;

  if (!response.ok) {
    throw new Error(data?.message || raw || `GitHub request failed (${response.status}).`);
  }

  return data;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  try {
    const { repoOwner, repoName, repoBranch } = requireConfig(["githubToken", "repoOwner", "repoName"]);
    const response = await requestGitHub(
      `/repos/${encodeURIComponent(repoOwner)}/${encodeURIComponent(repoName)}/contents/src/content/site.json?ref=${encodeURIComponent(repoBranch)}`
    );

    if (!response?.content) {
      throw new Error("Published site content was not found.");
    }

    const content = Buffer.from(String(response.content).replace(/\n/g, ""), "base64").toString("utf8");
    const draft = safeParseJson(content);

    if (!draft) {
      throw new Error("Published site content is invalid JSON.");
    }

    noStore(res);
    return json(res, 200, draft);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load site content.";
    return json(res, 500, { message });
  }
}
