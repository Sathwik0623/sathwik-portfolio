import type { ComponentType, SVGProps } from "react";
import {
  SiPython,
  SiOpenjdk,
  SiJavascript,
  SiFastapi,
  SiNodedotjs,
  SiJsonwebtokens,
  SiReact,
  SiHtml5,
  SiCss,
  SiMysql,
  SiMongodb,
  SiGit,
  SiOpencv,
  SiExpress,
} from "react-icons/si";
import {
  Database,
  Webhook,
  BrainCircuit,
  Wand2,
  ScanText,
  Network,
  Wifi,
  Shield,
  ListTree,
  GitBranch,
  Component,
  Regex,
  type LucideIcon,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>> | LucideIcon;

// Centralized so content/skills.ts can stay plain strings while the UI
// consistently resolves each technology to a Simple Icons brand mark,
// falling back to a generic Lucide icon for concepts with no real logo.
const TECH_ICONS: Record<string, IconComponent> = {
  Python: SiPython,
  Java: SiOpenjdk,
  SQL: Database,
  JavaScript: SiJavascript,
  FastAPI: SiFastapi,
  "REST APIs": Webhook,
  "JWT Authentication": SiJsonwebtokens,
  "Node.js": SiNodedotjs,
  React: SiReact,
  HTML: SiHtml5,
  CSS: SiCss,
  "LLM Integration": BrainCircuit,
  "Prompt Engineering": Wand2,
  "OCR Pipelines": ScanText,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  "Routing & Switching": Network,
  "IP Connectivity": Wifi,
  "Network Security": Shield,
  "Data Structures": ListTree,
  Algorithms: GitBranch,
  OOP: Component,
  Git: SiGit,
  OpenCV: SiOpencv,
  "GPT-4.1 Vision": BrainCircuit,
  RapidFuzz: Regex,
  JWT: SiJsonwebtokens,
  "Express.js": SiExpress,
};

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const Icon = TECH_ICONS[name] ?? Database;
  return <Icon className={className} aria-hidden="true" />;
}
