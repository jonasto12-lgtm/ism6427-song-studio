import { suno, json } from "./_suno.mjs";

const clip = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export default async (req, context) => {
  if (req.method !== "POST") return json({ error: "Use POST." }, 405);

  let input;
  try {
    input = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const custom = input.mode === "custom";
  const instrumental = Boolean(input.instrumental);
  const body = {
    customMode: custom,
    instrumental,
    model: "V6",
    // Required by the API; we poll for results instead of using the callback.
    callBackUrl: `${context.site?.url || new URL(req.url).origin}/api/callback`,
  };

  if (custom) {
    const style = clip(input.style, 1000);
    const title = clip(input.title, 80);
    const lyrics = clip(input.lyrics, 5000);
    if (!style) return json({ error: "Add a style (for example: lo-fi hip hop, mellow)." }, 400);
    if (!instrumental && !lyrics) return json({ error: "Add lyrics, or switch on Instrumental." }, 400);
    body.style = style;
    if (title) body.title = title;
    if (!instrumental) body.prompt = lyrics;
  } else {
    const prompt = clip(input.prompt, 500);
    if (!prompt) return json({ error: "Describe the song you want." }, 400);
    body.prompt = prompt;
  }

  const r = await suno("/generate", { method: "POST", body: JSON.stringify(body) });
  if (!r.ok) return json({ error: r.error }, r.status);
  return json({ taskId: r.data.taskId });
};

export const config = { path: "/api/generate", method: "POST" };
