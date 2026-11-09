// Shared helper for talking to SunoAPI.org. The key lives only in the
// SUNO_API_KEY environment variable on Netlify, never in the browser.
const BASE = "https://api.sunoapi.org/api/v1";

export async function suno(path, init = {}) {
  const key = Netlify.env.get("SUNO_API_KEY");
  if (!key) {
    return { ok: false, status: 500, error: "SUNO_API_KEY is not set on the server." };
  }
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  let body;
  try {
    body = await res.json();
  } catch {
    return { ok: false, status: 502, error: `Suno API returned HTTP ${res.status}.` };
  }
  if (!res.ok || body.code !== 200) {
    return { ok: false, status: 502, error: body.msg || `Suno API error (code ${body.code}).`, code: body.code };
  }
  return { ok: true, data: body.data };
}

export const json = (obj, status = 200) => Response.json(obj, { status });
