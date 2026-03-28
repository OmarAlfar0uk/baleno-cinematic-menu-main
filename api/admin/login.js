import { getRuntimeConfig } from "../_lib/config.js";
import { assertSameOrigin, json, methodNotAllowed, readJsonBody } from "../_lib/http.js";
import { createAdminSessionCookie } from "../_lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    assertSameOrigin(req);

    const { password } = await readJsonBody(req);
    const config = getRuntimeConfig();

    if (!config.adminPassword) {
      return json(res, 500, {
        message: "ADMIN_PASSWORD is not configured on Vercel.",
      });
    }

    if (!config.adminSessionSecret) {
      return json(res, 500, {
        message: "ADMIN_SESSION_SECRET is not configured on Vercel.",
      });
    }

    if (password !== config.adminPassword) {
      return json(res, 401, {
        message: "Wrong admin password.",
      });
    }

    res.setHeader("Set-Cookie", createAdminSessionCookie());
    return json(res, 200, { ok: true });
  } catch (error) {
    const status = typeof error?.status === "number" ? error.status : 500;
    const message = error instanceof Error ? error.message : "Could not log in.";
    return json(res, status, { message });
  }
}
