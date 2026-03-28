import crypto from "node:crypto";
import { getRuntimeConfig } from "./config.js";
import { httpError, parseCookies } from "./http.js";

const COOKIE_NAME = "baleno_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  if (options.expires) {
    parts.push(`Expires=${options.expires.toUTCString()}`);
  }

  parts.push(`Path=${options.path || "/"}`);

  if (options.httpOnly !== false) {
    parts.push("HttpOnly");
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  if (options.secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function shouldUseSecureCookie() {
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV || "";
  return env !== "development";
}

export function createAdminSessionCookie() {
  const { adminSessionSecret } = getRuntimeConfig();
  if (!adminSessionSecret) {
    throw new Error("Missing required environment variables: adminSessionSecret");
  }

  const payload = Buffer.from(
    JSON.stringify({
      role: "admin",
      exp: Date.now() + SESSION_TTL_SECONDS * 1000,
    }),
    "utf8"
  ).toString("base64url");

  const signature = sign(payload, adminSessionSecret);

  return serializeCookie(COOKIE_NAME, `${payload}.${signature}`, {
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    secure: shouldUseSecureCookie(),
  });
}

export function clearAdminSessionCookie() {
  return serializeCookie(COOKIE_NAME, "", {
    maxAge: 0,
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    secure: shouldUseSecureCookie(),
  });
}

export function getAdminSession(req) {
  const { adminSessionSecret } = getRuntimeConfig();
  if (!adminSessionSecret) return null;

  const cookies = parseCookies(req);
  const rawSession = cookies[COOKIE_NAME];
  if (!rawSession) return null;

  const [payload, signature] = rawSession.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = sign(payload, adminSessionSecret);
  const providedSignature = Buffer.from(signature);
  const validSignature = Buffer.from(expectedSignature);

  if (providedSignature.length !== validSignature.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(providedSignature, validSignature)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (session?.role !== "admin") return null;
    if (typeof session.exp !== "number" || session.exp <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function requireAdminSession(req) {
  const session = getAdminSession(req);
  if (!session) {
    throw httpError(401, "Please log in to the admin dashboard first.");
  }

  return session;
}
