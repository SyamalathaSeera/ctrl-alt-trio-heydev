import { notFound } from "next/navigation";
import { DemoInbox } from "@/components/DemoInbox";
import { memberBySlug } from "@/data/team";

export default async function MemberInboxPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!memberBySlug(slug)) notFound();
  return <DemoInbox slug={slug} />;
}
