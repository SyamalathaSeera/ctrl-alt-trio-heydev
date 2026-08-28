import type { Project } from "@/lib/types";

export const SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "Design",
  "Go",
  "Rust",
  "Product",
  "DevOps",
  "Mobile",
  "AI/ML",
  "Firebase",
] as const;

export const DEFAULT_SKILLS = ["React", "TypeScript"];

export const PROJECTS: Project[] = [
  {
    id: "metro-pulse",
    title: "Metro Pulse",
    owner: "Priya K.",
    ownerRole: "Python backend",
    problem:
      "Live WMATA delays that actually explain why your Orange Line is sitting in the tunnel — not just 'delay.'",
    theyHave: ["Python", "Firebase"],
    theyNeed: ["React", "Next.js"],
    tags: ["side-project"],
    city: "Arlington, VA",
  },
  {
    id: "office-hours",
    title: "Office Hours Board",
    owner: "Marcus T.",
    ownerRole: "Community lead",
    problem:
      "GDG mentors are drowning in DMs. A public board where you book a 15-minute review slot, no Slack archaeology.",
    theyHave: ["Product", "Firebase"],
    theyNeed: ["Design", "Next.js"],
    tags: ["hackathon"],
    city: "DevFest DC",
  },
  {
    id: "open-311",
    title: "Open 311 Lite",
    owner: "Elena R.",
    ownerRole: "Civic technologist",
    problem:
      "Neighbors report potholes in a group chat. A tiny map + form that files them like 311, without the 311 wait.",
    theyHave: ["Python", "DevOps"],
    theyNeed: ["TypeScript", "Design"],
    tags: ["oss"],
    city: "Washington, DC",
  },
  {
    id: "capsule",
    title: "Capsule",
    owner: "Jordan A.",
    ownerRole: "iOS / Android",
    problem:
      "A local-first daily log for builders. No cloud until you opt in. Needs a web companion that doesn't fight the mobile app.",
    theyHave: ["Mobile", "Rust"],
    theyNeed: ["React", "TypeScript"],
    tags: ["oss"],
    city: "Remote",
  },
  {
    id: "festival-bites",
    title: "Festival Bites",
    owner: "Samira H.",
    ownerRole: "Full-stack",
    problem:
      "DevFest lunch hits every table at once. A live map of dietary-safe food within a two-block walk of Fuse.",
    theyHave: ["Next.js", "Firebase"],
    theyNeed: ["Mobile", "Design"],
    tags: ["hackathon"],
    city: "Mason Square",
  },
  {
    id: "rusty-queue",
    title: "Rusty Queue",
    owner: "Chris N.",
    ownerRole: "Systems",
    problem:
      "A tiny durable job queue in Rust that Postgres-backed apps can actually adopt. Docs and a dashboard are the missing half.",
    theyHave: ["Rust", "Go"],
    theyNeed: ["DevOps", "TypeScript"],
    tags: ["oss"],
    city: "Remote",
  },
  {
    id: "pairboard",
    title: "Pairboard",
    owner: "Avery L.",
    ownerRole: "Designer-engineer",
    problem:
      "Pairing over Zoom is a shared doc and hope. A 30-second board: one snippet, one cursor, one timer.",
    theyHave: ["Design", "Product"],
    theyNeed: ["React", "TypeScript"],
    tags: ["side-project"],
    city: "Alexandria, VA",
  },
  {
    id: "model-garden",
    title: "Garden Chat",
    owner: "Nina V.",
    ownerRole: "ML engineer",
    problem:
      "A Gemini playground that remembers the last three prompts you actually liked — not a graveyard of chats.",
    theyHave: ["AI/ML", "Python"],
    theyNeed: ["Next.js", "Design"],
    tags: ["hackathon"],
    city: "DevFest DC",
  },
  {
    id: "a11y-forms",
    title: "A11y Forms Kit",
    owner: "Devon P.",
    ownerRole: "Frontend",
    problem:
      "Copy-paste form fields that pass axe out of the box. Labels, errors, and focus that government sites could steal.",
    theyHave: ["React", "TypeScript"],
    theyNeed: ["Design", "Product"],
    tags: ["oss"],
    city: "Remote",
  },
  {
    id: "wardrobe-weather",
    title: "Wardrobe Weather",
    owner: "Kai M.",
    ownerRole: "React",
    problem:
      "DC humidity lies. Tell me whether the linen shirt survives the Metro walk, from a photo of the day's outfit.",
    theyHave: ["React", "Next.js"],
    theyNeed: ["Python", "AI/ML"],
    tags: ["side-project"],
    city: "Washington, DC",
  },
];
