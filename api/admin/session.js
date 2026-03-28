import { getRuntimeConfig } from "../_lib/config.js";
import { json, methodNotAllowed, noStore } from "../_lib/http.js";
import { getAdminSession } from "../_lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  const session = getAdminSession(req);
  const config = getRuntimeConfig();

  noStore(res);

  return json(res, 200, {
    authenticated: Boolean(session),
    label: session ? "Admin session active" : null,
    repo: config.repoOwner && config.repoName ? `${config.repoOwner}/${config.repoName}` : null,
    branch: config.repoBranch || null,
  });
}
