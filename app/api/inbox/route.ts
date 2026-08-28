import { listPings } from "@/lib/inbox-store";
import { memberBySlug } from "@/data/team";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("member")?.trim() ?? "";
  const member = slug ? memberBySlug(slug) : null;
  if (slug && !member) {
    return Response.json({ error: "Unknown teammate" }, { status: 404 });
  }
  return Response.json({
    pings: listPings(member?.projectId),
  });
}
