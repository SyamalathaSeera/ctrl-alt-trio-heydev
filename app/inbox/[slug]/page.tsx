import { notFound } from "next/navigation";
import { DemoInbox } from "@/components/DemoInbox";
import { TEAM_MEMBERS, memberBySlug } from "@/data/team";

export function generateStaticParams() {
  return TEAM_MEMBERS.map((member) => ({ slug: member.slug }));
}

export const dynamicParams = false;

export default async function MemberInboxPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!memberBySlug(slug)) notFound();
  return <DemoInbox slug={slug} />;
}
