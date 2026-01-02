export type Project = {
  slug: string
  title: string
  year: string
  outcome: string
  description: string
  tags: string[]
  image?: string
  link?: string
  external?: boolean
  cta?: string;
}

export const projects: Project[] = [
  //{
   // slug: "agent-store",
    // title: "Agent Store GTM",
    //year: "2024",
    //outcome: "Shipped",
    //description:
    //  "Led messaging, positioning, and launch strategy for Microsoft’s Agent Store, partnering with engineering and design.",
    //tags: ["Product", "AI", "GTM"],
    // image: "/projects/agent-store.png",
    //cta: "Learn more",
 // },

   {
    slug: "hot-dog",
    title: "Hotdog or Not Hotdog",
    year: "2025",
    outcome: "Live",
    description:
      "Built the iconic HBO's Silicon Valley app using GPT-Ro-mini vision API, with rate limiting, CAPTCHA protection, and cost controls.",
    tags: ["AI", "Vision API", "Next.js", "hotdog", "not hotdog"],
    link: "/hotdog",
    external: true,
    image: "/projects/hotdogornot/Not-hotdog.webp",
    cta: "Try it out",
  },

  {
    slug: "garmin_mcp",
    title: "Garmin MCP Server",
    year: "2025",
    outcome: "Live",
    description:
      "An MCP server that connects 9 years of Garmin health data to Claude Desktop. Ask questions in plain English, get answers from real data.",
    tags: ["MCP", "Claude", "Next.js", "Supabase"],
    link: "/garmin_mcp",
    external: true,
    image: "/projects/garmin_mcp/mcp-tool-call.png",
    cta: "Take a look",
  },

    {
    slug: "ai-evals",
    title: "AI Evaluation Framework",
    year: "2025",
    outcome: "Work in Progress",
    description:
      "Designed an internal evaluation framework for LLM agents with clear success metrics and tradeoff analysis.",
    tags: ["AI", "Evaluation", "Systems"],
    // image: "/projects/ai-evals.png",
  },
]
