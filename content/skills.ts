import { SkillCategory } from "./types";

export const skills: SkillCategory[] = [
  { category: "Languages", items: ["Python", "Java", "SQL", "JavaScript"] },
  { category: "Backend", items: ["FastAPI", "REST APIs", "JWT Authentication", "Node.js"] },
  { category: "Frontend", items: ["React", "HTML", "CSS", "JavaScript"] },
  { category: "AI / ML", items: ["LLM Integration", "Prompt Engineering", "OCR Pipelines"] },
  { category: "Databases", items: ["MySQL", "MongoDB"] },
  {
    category: "Networking",
    items: ["Routing & Switching", "IP Connectivity", "Network Security"],
  },
  { category: "CS Fundamentals", items: ["Data Structures", "Algorithms", "OOP"] },
  { category: "Tools", items: ["Git"] },
];
