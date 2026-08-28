"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TEAM_MEMBERS } from "@/data/team";

type Slot = {
  projectId: string;
  title: string;
  owner: string;
  maskedTo: string | null;
};

export function InboxChooser() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [emails, setEmails] = useState(["", "", ""]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetch("/api/team-emails", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { slots?: Slot[] }) => setSlots(data.slots ?? []))
      .catch(() => undefined);
  }, []);

  async function saveEmails(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    const res = await fetch("/api/team-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails }),
    });
    const data = (await res.json()) as { error?: string; slots?: Slot[] };
    if (!res.ok) {
      setFormError(data.error || "Need three emails.");
      return;
    }
    setSlots(data.slots ?? []);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-300">
        Team only
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl italic text-stone-50">
        Whose pings?
      </h1>
      <p className="mt-3 text-sm leading-6 text-stone-300">
        Pings are not a shared inbox. Each of you opens only your page. A judge
        swipe on Puja&apos;s card shows up for Puja, not everyone.
      </p>
      <div className="mt-6 grid gap-3">
        {TEAM_MEMBERS.map((member) => (
          <Link
            key={member.slug}
            href={`/inbox/${member.slug}`}
            className="rounded-[24px] border border-white/10 bg-[#16111a] px-5 py-4 text-lg font-semibold text-stone-50"
          >
            I am {member.name}
          </Link>
        ))}
      </div>

      <form
        onSubmit={saveEmails}
        className="mt-8 rounded-[24px] border border-white/10 bg-[#16111a] p-4"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
          Set the three emails once
        </p>
        {(slots.length ? slots : TEAM_MEMBERS).map((slot, index) => {
          const owner = "owner" in slot ? slot.owner : slot.name;
          const title = "title" in slot ? slot.title : TEAM_MEMBERS[index].name;
          const masked = "maskedTo" in slot ? slot.maskedTo : null;
          return (
            <label
              key={TEAM_MEMBERS[index].projectId}
              className="mt-3 block text-xs font-semibold uppercase tracking-wider text-stone-500"
            >
              {title} · {owner}
              {masked ? (
                <span className="ml-2 font-normal normal-case text-rose-200">
                  {masked}
                </span>
              ) : null}
              <input
                type="email"
                value={emails[index]}
                onChange={(event) => {
                  const next = [...emails];
                  next[index] = event.target.value;
                  setEmails(next);
                }}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-normal normal-case text-stone-50 outline-none"
                placeholder={`${owner.toLowerCase()}@gmail.com`}
              />
            </label>
          );
        })}
        {formError ? <p className="mt-2 text-sm text-rose-300">{formError}</p> : null}
        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-rose-500 py-2.5 text-sm font-semibold text-white"
        >
          Save three emails
        </button>
      </form>
    </div>
  );
}
