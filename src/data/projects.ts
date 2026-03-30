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
  {
    slug: "garmin_mcp",
    title: "Garmin MCP Server",
    year: "2025",
    outcome: "Live",
    description:
      "Connected 9 years of personal health data to Claude Desktop via MCP. Ask questions in plain English — sleep trends, training load, recovery patterns — and get answers from real Garmin data.",
    tags: ["MCP", "Claude", "Supabase", "Data Pipeline"],
    link: "/garmin_mcp",
    external: true,
    image: "/projects/garmin_mcp/garmin-hero-photo.png",
    cta: "Take a look",
  },

  {
    slug: "my-cards-bingo",
    title: "Bingo Crew",
    year: "2026",
    outcome: "Prototype",
    description:
      "A web app for creating, sharing, and playing custom bingo cards. Built with real-time collaboration, image export, and shareable links — from game nights to team offsites.",
    tags: ["Product", "Web App", "Sharing", "Real-time"],
    link: "https://bingocrew.replit.app",
    external: true,
    image: "/projects//bingo/bingo-2.png",
    cta: "Open app",
  },

  {
    slug: "hot-dog",
    title: "Hot Dog or Not",
    year: "2025",
    outcome: "Live MVP",
    description:
      "The classic Silicon Valley app, built in a weekend. GPT-4o-mini vision API with Cloudflare Turnstile, rate limiting, and cost controls — shipped fast with guardrails.",
    tags: ["AI", "Vision API", "Rapid Prototype", "Next.js"],
    link: "/hotdog",
    external: true,
    image: "/projects/hotdogornot/Not-hotdog.png",
    cta: "Try it out",
  },
]
