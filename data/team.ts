import type { Project } from "@/lib/types";

export const TEAM_MEMBERS = [
  {
    slug: "syamalatha",
    projectId: "team-1",
    name: "Syamalatha",
  },
  {
    slug: "puja",
    projectId: "team-2",
    name: "Puja",
  },
  {
    slug: "kavya",
    projectId: "team-3",
    name: "Kavya",
  },
] as const;

export type TeamSlug = (typeof TEAM_MEMBERS)[number]["slug"];

export function memberBySlug(slug: string) {
  return TEAM_MEMBERS.find((member) => member.slug === slug) ?? null;
}

export function memberByProjectId(projectId: string) {
  return TEAM_MEMBERS.find((member) => member.projectId === projectId) ?? null;
}

export const TEAM_PROJECTS: Project[] = [
  {
    id: "team-1",
    title: "HeyDev Live",
    owner: "Syamalatha",
    ownerRole: "Teammate",
    problem:
      "The collab deck you’re on right now. Right swipe and only Syamalatha gets the ping.",
    theyHave: ["TypeScript", "Product"],
    theyNeed: ["React"],
    tags: ["hackathon"],
    city: "DevFest DC",
    emailCipher:
      "NW1KRu3w6lHiSryw.1-paQtdKlBWsNwNYG7zdLw.z_jzFzlfhupYNWqsbu-FtiZOdWUNjQ",
  },
  {
    id: "team-2",
    title: "Pairboard DC",
    owner: "Puja",
    ownerRole: "Teammate",
    problem:
      "A 30-second pairing board for this room. Right swipe notifies Puja only.",
    theyHave: ["Design", "Product"],
    theyNeed: ["React"],
    tags: ["hackathon"],
    city: "DevFest DC",
    emailCipher:
      "tEu7t79qzPHdWTz1.1-s3SMKlNA6qt6DZe5yC8Q.7YTtPmNbk0bL-ywSaDW7geAHD7XSug",
  },
  {
    id: "team-3",
    title: "Fest Queue",
    owner: "Kavya",
    ownerRole: "Teammate",
    problem:
      "Office-hours waitlist so mentors stop drowning in DMs. Right swipe notifies Kavya only.",
    theyHave: ["Firebase", "Product"],
    theyNeed: ["React"],
    tags: ["hackathon"],
    city: "DevFest DC",
    emailCipher:
      "nFUm1m-E-dmx03BR.Iy8TEk9UaScRZttPC4035Q.IDQG0ZGdALVIlLghgxCQZR02iAH21w",
  },
];
