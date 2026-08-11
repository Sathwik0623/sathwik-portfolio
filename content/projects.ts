import { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "farmerverify-ai",
    name: "FarmerVerify AI",
    tagline: "AI-powered document verification that cut farmer onboarding from 14 days to under 2 hours",
    badge: "Cisco Tech for Social Good Hackathon 2026 — Winner",
    problem:
      "Farmers for Forests, an NGO operating across rural Maharashtra, relied on manual document verification to onboard farmers — a process that took up to 14 days per applicant and was prone to error, duplication, and fraud.",
    solution:
      "Designed and built an 8-stage AI verification pipeline that automates document quality checks, OCR, identity matching, deduplication, and fraud detection, backed by a trilingual voice-guided chatbot and an admin dashboard for staff review — reducing onboarding time to under 2 hours.",
    architecture: [
      {
        title: "1. Document intake & quality check",
        description: "OpenCV-based checks validate image quality (blur, glare, cropping) before a document enters the pipeline.",
      },
      {
        title: "2. LLM-based OCR",
        description: "GPT-4.1 Vision extracts structured fields from farmer identity and land documents.",
      },
      {
        title: "3. Fuzzy matching",
        description: "RapidFuzz cross-checks extracted data against NGO records to handle spelling and formatting variance.",
      },
      {
        title: "4. Deduplication",
        description: "Detects duplicate or previously onboarded applicants across the NGO database.",
      },
      {
        title: "5. Fraud detection",
        description: "Flags suspicious or tampered submissions for manual review.",
      },
      {
        title: "6. Secure data handling",
        description: "JWT authentication, input validation, and audit-compliant data governance protect applicant data end-to-end.",
      },
      {
        title: "7. Trilingual voice chatbot",
        description: "Guides farmers through submission in English, Hindi, or Marathi.",
      },
      {
        title: "8. AI-powered admin dashboard",
        description: "Gives NGO staff a visual document cross-check view and one-click export to the NGO database.",
      },
    ],
    tech: ["Python", "FastAPI", "OpenCV", "GPT-4.1 Vision", "RapidFuzz", "JavaScript", "JWT"],
    contributions: [
      "Designed the end-to-end 8-stage verification pipeline architecture.",
      "Implemented OpenCV quality checks, LLM-based OCR, and RapidFuzz fuzzy matching.",
      "Applied secure coding practices: JWT authentication, input validation, and audit-compliant data governance.",
      "Built the trilingual (English/Hindi/Marathi) voice-guided chatbot.",
      "Built the AI-powered admin dashboard with visual document cross-check and one-click NGO database export.",
    ],
    results: [
      "Reduced farmer onboarding time from 14 days to under 2 hours across rural Maharashtra.",
      "Won the Cisco Tech for Social Good Hackathon 2026.",
      "Recognized by Cisco Executive Leadership (SVP) for social impact and technical sophistication.",
    ],
    links: [{ label: "GitHub", url: "https://github.com/Sathwik0623/FarmerVerify-AI" }],
    featured: true,
    pressCoverage: true,
    certificateNote:
      "Awarded a Cisco Certificate of Achievement (April 15, 2026), signed by Brian Tippens (SVP & Chief Social Impact and Inclusion Officer) and Bhaskar Jayakrishnan (SVP, CX Engineering & CX Product Management).",
  },
  {
    slug: "network-health-automation",
    name: "AI-Powered Network Health Automation System",
    tagline: "CLI diagnostics automation with AI-assisted summarization for faster network troubleshooting",
    solution:
      "Built a Python tool that automates CLI-based network diagnostics, collects logs, and monitors CPU/memory usage, then applies AI summarization to help identify system issues faster.",
    problem:
      "Manually running CLI diagnostics and interpreting raw logs/metrics to spot network issues is slow and repetitive.",
    tech: ["Python", "FastAPI"],
    contributions: [
      "Built the CLI diagnostics automation and log/metric collection pipeline.",
      "Integrated AI summarization of diagnostic output to assist in identifying issues.",
    ],
    results: [],
    links: [{ label: "GitHub", url: "https://github.com/Sathwik0623/router-health-assistant" }],
    featured: true,
  },
  {
    slug: "chococraft",
    name: "ChocoCraft",
    tagline: "Full-stack MERN e-commerce site for personalized chocolate orders",
    period: "Apr 2025 – Jun 2025",
    problem:
      "Needed a full-stack e-commerce experience for personalized chocolate orders, including customer-facing storefront and store-side management.",
    solution:
      "Built a full-stack MERN application with authentication, an admin dashboard, and REST APIs to manage products and orders.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "HTML", "CSS", "JavaScript"],
    contributions: [
      "Built the full-stack application end to end using the MERN stack.",
      "Implemented authentication and an admin dashboard.",
      "Designed and built REST APIs for the storefront and admin workflows.",
    ],
    results: [],
    links: [],
    featured: false,
  },
];
