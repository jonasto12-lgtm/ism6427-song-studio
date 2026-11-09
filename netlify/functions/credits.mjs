import { suno, json } from "./_suno.mjs";

export default async () => {
  const r = await suno("/generate/credit");
  if (!r.ok) return json({ error: r.error }, r.status);
  return json({ credits: r.data });
};

export const config = { path: "/api/credits" };
