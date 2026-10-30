// Cloudflare Pages Function: POST /api/contact
// Sends contact-form messages to your inbox through Resend (free: 3,000 emails/month).
//
// Set these in Cloudflare → your Pages project → Settings → Variables and secrets:
//   RESEND_API_KEY   your Resend API key (keep it secret)
//   CONTACT_TO       the inbox that receives messages
//   CONTACT_FROM     a sender on your verified Resend domain, e.g. "Site <site@ifeanyiemmanuel.com>"
//
// This file only runs on Cloudflare, not during `npm run dev`.

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO: string;
  CONTACT_FROM: string;
}

type Ctx = { request: Request; env: Env };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export async function onRequestPost({ request, env }: Ctx): Promise<Response> {
  let data: Record<string, string>;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  // Honeypot: bots fill hidden fields; pretend it worked.
  if (data.company_site) return json({ ok: true });

  const name = (data.name ?? "").trim().slice(0, 200);
  const email = (data.email ?? "").trim().slice(0, 200);
  const message = (data.message ?? "").trim().slice(0, 5000);
  const timeline = (data.timeline ?? "").trim().slice(0, 100);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Please fill in your name, a valid email and a message." }, 422);
  }
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return json({ error: "Contact form is not configured yet." }, 503);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `New message from ${name} (ifeanyiemmanuel.com)`,
      text: `Name: ${name}\nEmail: ${email}\nTimeline: ${timeline || "not given"}\n\n${message}`,
    }),
  });

  return res.ok ? json({ ok: true }) : json({ error: "Could not send right now." }, 502);
}
