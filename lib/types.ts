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
  emailCipher: string;
};

export type MatchRecord = {
  project: Project;
  reason: string;
  icebreaker: string;
  source: "gemini" | "template";
  at: string;
  notify?: {
    delivered: boolean;
    maskedTo: string;
    threadId?: string;
  };
};

export type ChatMessage = {
  id: string;
  from: "judge" | "owner";
  text: string;
  at: string;
};

export type ChatThread = {
  id: string;
  projectId: string;
  projectTitle: string;
  owner: string;
  accepted: boolean;
  messages: ChatMessage[];
};

export type InboxPing = {
  id: string;
  at: string;
  projectId: string;
  projectTitle: string;
  owner: string;
  emailCipher: string;
  maskedTo: string;
  icebreaker: string;
  skills: string[];
};
