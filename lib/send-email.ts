type SendInput = {
  to: string;
  subject: string;
  text: string;
  origin?: string;
};

export type SendResult = {
  sent: boolean;
  via: "resend" | "formsubmit";
  hint?: string;
};

function siteOrigin(origin?: string) {
  const raw =
    origin?.trim() ||
    process.env.PUBLIC_APP_URL?.trim() ||
    "https://del-gained-arguments-steady.trycloudflare.com";
  return raw.replace(/\/$/, "");
}

export async function sendMatchEmail({
  to,
  subject,
  text,
  origin,
}: SendInput): Promise<SendResult> {
  try {
    const resendKey = process.env.RESEND_API_KEY?.trim();
    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM?.trim() || "HeyDev <onboarding@resend.dev>",
          to: [to],
          subject,
          text,
        }),
      });
      if (!res.ok) {
        return { sent: false, via: "resend", hint: "Resend rejected the mail." };
      }
      return { sent: true, via: "resend" };
    }

    const site = siteOrigin(origin);
    const res = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: site,
          Referer: `${site}/`,
        },
        body: JSON.stringify({
          _subject: subject,
          _template: "box",
          _captcha: "false",
          name: "HeyDev",
          message: text,
        }),
      },
    );

    const raw = await res.text();
    let parsed: { success?: string | boolean; message?: string } = {};
    try {
      parsed = JSON.parse(raw) as { success?: string | boolean; message?: string };
    } catch {
      parsed = {};
    }

    const ok =
      res.ok &&
      parsed.success !== false &&
      parsed.success !== "false";
    const message = parsed.message?.trim() || "";
    const needsActivation = /activat/i.test(message);

    if (needsActivation) {
      return {
        sent: false,
        via: "formsubmit",
        hint: "Check Gmail (and spam) for FormSubmit “Activate Form”, click it once, then swipe again.",
      };
    }

    if (!ok) {
      return {
        sent: false,
        via: "formsubmit",
        hint: message || "FormSubmit did not accept the mail.",
      };
    }

    return { sent: true, via: "formsubmit" };
  } catch {
    return { sent: false, via: "formsubmit", hint: "Could not reach the mail provider." };
  }
}
