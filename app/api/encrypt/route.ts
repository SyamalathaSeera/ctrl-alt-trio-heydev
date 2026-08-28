import { encryptEmail } from "@/lib/email-crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = body.email?.trim() ?? "";
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!email.includes("@")) {
    return Response.json({ error: "Need a real email" }, { status: 400 });
  }

  return Response.json({ emailCipher: encryptEmail(email) });
}
