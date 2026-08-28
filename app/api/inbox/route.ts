import { listPings } from "@/lib/inbox-store";
import { memberBySlug } from "@/data/team";
import { corsJson, OPTIONS } from "@/lib/cors";

export { OPTIONS };
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("member")?.trim() ?? "";
  const member = slug ? memberBySlug(slug) : null;
  if (slug && !member) {
    return corsJson({ error: "Unknown teammate" }, { status: 404 });
  }
  return corsJson({
    pings: listPings(member?.projectId),
  });
}
