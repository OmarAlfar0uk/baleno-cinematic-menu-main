import { assertSameOrigin, json, methodNotAllowed } from "../_lib/http.js";
import { clearAdminSessionCookie } from "../_lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    assertSameOrigin(req);
    res.setHeader("Set-Cookie", clearAdminSessionCookie());
    return json(res, 200, { ok: true });
  } catch (error) {
    const status = typeof error?.status === "number" ? error.status : 500;
    const message = error instanceof Error ? error.message : "Could not log out.";
    return json(res, status, { message });
  }
}
