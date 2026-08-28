import { encryptEmail } from "@/lib/email-crypto";
import { corsJson, OPTIONS } from "@/lib/cors";

export { OPTIONS };
export const runtime = "nodejs";

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = body.email?.trim() ?? "";
  } catch {
    return corsJson({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!email.includes("@")) {
    return corsJson({ error: "Need a real email" }, { status: 400 });
  }

  return corsJson({ emailCipher: encryptEmail(email) });
}
