// SunoAPI requires a callback URL. The app polls /api/status instead,
// so this endpoint just acknowledges the notification.
export default async () => Response.json({ received: true });

export const config = { path: "/api/callback", method: "POST" };
