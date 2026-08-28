export type ProjectTag = "hackathon" | "oss" | "side-project";

export type Project = {
  id: string;
  title: string;
  owner: string;
  ownerRole: string;
  problem: string;
  theyHave: string[];
  theyNeed: string[];
  tags: ProjectTag[];
  city: string;
};

export type MatchRecord = {
  project: Project;
  reason: string;
  icebreaker: string;
  source: "gemini" | "template";
  at: string;
};
