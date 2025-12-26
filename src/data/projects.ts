export type Project = {
  slug: string
  title: string
  year: string
  outcome: string
  description: string
  tags: string[]
  image?: string
}

export const projects: Project[] = [
  {
    slug: "agent-store",
    title: "Agent Store GTM",
    year: "2024",
    outcome: "Shipped",
    description:
      "Led messaging, positioning, and launch strategy for Microsoft’s Agent Store, partnering with engineering and design.",
    tags: ["Product", "AI", "GTM"],
    // image: "/projects/agent-store.png",
  },
  {
    slug: "ai-evals",
    title: "AI Evaluation Framework",
    year: "2025",
    outcome: "Prototype",
    description:
      "Designed an internal evaluation framework for LLM agents with clear success metrics and tradeoff analysis.",
    tags: ["AI", "Evaluation", "Systems"],
    // image: "/projects/ai-evals.png",
  },
  {
    slug: "pm-portfolio",
    title: "PM Portfolio",
    year: "2025",
    outcome: "Live",
    description:
      "Built a design-forward PM portfolio using Next.js, Tailwind, and structured product narratives.",
    tags: ["UX", "Next.js", "Tailwind"],
    // image: "/projects/pm-portfolio.png",
  },
  {
    slug: "hot-dog",
    title: "Hot Dog",
    year: "2025",
    outcome: "Live",
    description:
      "Built a design-forward PM portfolio using Next.js, Tailwind, and structured product narratives.",
    tags: ["UX", "Next.js", "Tailwind"],
    // image: "/projects/hot-dog.png",
  },
]
