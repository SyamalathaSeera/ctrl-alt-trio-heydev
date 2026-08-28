type SendInput = {
  to: string;
  subject: string;
  text: string;
};

export async function sendMatchEmail({ to, subject, text }: SendInput) {
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
      return { sent: false, via: "resend" as const };
    }
    return { sent: true, via: "resend" as const };
  }

  const res = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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

  if (!res.ok) {
    return { sent: false, via: "formsubmit" as const };
  }
  return { sent: true, via: "formsubmit" as const };
  } catch {
    return { sent: false, via: "formsubmit" as const };
  }
}
