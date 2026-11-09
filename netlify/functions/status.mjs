import { suno, json } from "./_suno.mjs";

const FAILED = new Set(["CREATE_TASK_FAILED", "GENERATE_AUDIO_FAILED", "CALLBACK_EXCEPTION", "SENSITIVE_WORD_ERROR"]);

export default async (req) => {
  const taskId = new URL(req.url).searchParams.get("taskId") || "";
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(taskId)) return json({ error: "Missing or invalid taskId." }, 400);

  const r = await suno(`/generate/record-info?taskId=${encodeURIComponent(taskId)}`);
  if (!r.ok) return json({ error: r.error }, r.status);

  const d = r.data || {};
  const tracks = (d.response?.sunoData || []).map((t) => ({
    id: t.id,
    title: t.title,
    tags: t.tags,
    lyrics: t.prompt,
    duration: t.duration,
    image: t.image_url || t.imageUrl,
    audio: t.audio_url || t.audioUrl || "",
    stream: t.stream_audio_url || t.streamAudioUrl || "",
  }));

  let error = null;
  if (FAILED.has(d.status)) {
    error =
      d.status === "SENSITIVE_WORD_ERROR"
        ? "Suno blocked this prompt. Avoid artist names or sensitive words and try again."
        : d.errorMessage || "Song generation failed. Try again.";
  }

  return json({ status: d.status, done: d.status === "SUCCESS", error, tracks });
};

export const config = { path: "/api/status" };
