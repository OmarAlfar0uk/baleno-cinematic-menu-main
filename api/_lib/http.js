function setStatus(res, status) {
  if (typeof res.status === "function") {
    res.status(status);
    return;
  }

  res.statusCode = status;
}

export function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function noStore(res) {
  res.setHeader("Cache-Control", "no-store");
}

export function json(res, status, payload) {
  setStatus(res, status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

export function methodNotAllowed(res, methods) {
  setStatus(res, 405);
  res.setHeader("Allow", methods.join(", "));
  res.end(`Method not allowed. Use ${methods.join(", ")}.`);
}

export function parseCookies(req) {
  const raw = req.headers.cookie || "";

  return raw
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((acc, entry) => {
      const separatorIndex = entry.indexOf("=");
      if (separatorIndex === -1) return acc;

      const key = entry.slice(0, separatorIndex).trim();
      const value = entry.slice(separatorIndex + 1).trim();
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    throw httpError(400, "Request body must be valid JSON.");
  }
}

export function assertSameOrigin(req) {
  const method = String(req.method || "GET").toUpperCase();
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return;

  const origin = req.headers.origin;
  if (!origin) return;

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (!host) return;

  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || (String(host).includes("localhost") ? "http" : "https");
  const expectedOrigin = `${protocol}://${host}`;

  try {
    if (new URL(origin).origin !== expectedOrigin) {
      throw httpError(403, "Origin mismatch.");
    }
  } catch (error) {
    if (error instanceof Error && "status" in error) {
      throw error;
    }

    throw httpError(403, "Origin mismatch.");
  }
}
