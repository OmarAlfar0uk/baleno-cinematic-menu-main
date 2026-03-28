export function getRuntimeConfig() {
  return {
    adminPassword: process.env.ADMIN_PASSWORD || "",
    adminSessionSecret: process.env.ADMIN_SESSION_SECRET || process.env.PUBLISHING_SESSION_SECRET || "",
    githubToken: process.env.GITHUB_TOKEN || "",
    repoOwner: process.env.GITHUB_REPO_OWNER || process.env.VERCEL_GIT_REPO_OWNER || "",
    repoName: process.env.GITHUB_REPO_NAME || process.env.VERCEL_GIT_REPO_SLUG || "",
    repoBranch: process.env.GITHUB_REPO_BRANCH || "main",
  };
}

export function requireConfig(keys) {
  const config = getRuntimeConfig();
  const missing = keys.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return config;
}
