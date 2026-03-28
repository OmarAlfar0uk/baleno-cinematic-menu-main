import { assertSameOrigin, json, methodNotAllowed, readJsonBody } from "../_lib/http.js";
import { publishSiteDraft } from "../_lib/github.js";
import { requireAdminSession } from "../_lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    assertSameOrigin(req);
    requireAdminSession(req);

    const body = await readJsonBody(req);
    const publishedDraft = await publishSiteDraft(body);

    return json(res, 200, publishedDraft);
  } catch (error) {
    const status = typeof error?.status === "number" ? error.status : 500;
    const message = error instanceof Error ? error.message : "Publishing failed.";
    return json(res, status, { message });
  }
}
