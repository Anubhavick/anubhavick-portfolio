import { projectSchema, type Project } from "./schema";

/**
 * Real projects. `year` is an approximation (2025) for every entry — the
 * resume dates experience entries but not individual projects, and none of
 * the source material (resume, repo metadata, live sites) gives a firmer
 * date. Correct per-project if you have the real one.
 */
export const projects: Project[] = [
  {
    id: "proj-thebroadpost",
    slug: "thebroadpost",
    title: "The Broadpost",
    summary:
      "A self-hosted publishing platform with a Markdown editor, admin CMS, newsletter, and a custom SEO engine.",
    description:
      "Independent writers publishing on a hosted platform give up control over SEO, analytics, and monetization in exchange for convenience. The Broadpost is a self-hosted alternative: a Markdown editor and admin CMS for writing and organizing posts by category and tag, a newsletter system for building a mailing list directly, and a custom SEO engine — meta and OG tags, canonical URLs, and focus-keyword tracking — so posts are discoverable without a third-party platform's constraints. A built-in search algorithm and CTA blocks round out the reader-facing side.\n\nSince launch it has drawn 16K+ views across Germany, the US, India, and Canada, tracked through a real-time analytics dashboard that breaks down traffic by source and country.",
    role: "Full-stack developer",
    year: 2025,
    status: "shipped",
    featured: true,
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL"],
    links: [{ label: "Live", url: "https://thebroadpost.com", kind: "live" }],
  },
  {
    id: "proj-altyard",
    slug: "altyard",
    title: "Altyard",
    summary:
      "A fully customizable link-in-bio platform — a Linktree alternative that doesn't look like a template.",
    description:
      "Linktree popularized the link-in-bio page, but most implementations are template-locked and paywall basic customization. Altyard is a fully customizable alternative: authenticated users get a persistent, database-backed profile page for aggregating social links, stores, and content, with per-user theming so the result looks like them rather than a default skin.\n\nProfile data, link management, and theming are all backed by Supabase/PostgreSQL rather than a static config, so edits take effect immediately without a redeploy.",
    role: "Full-stack developer",
    year: 2025,
    status: "shipped",
    featured: true,
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL"],
    links: [{ label: "Live", url: "https://altyard.vercel.app", kind: "live" }],
  },
  {
    id: "proj-healthy-me",
    slug: "healthy-me",
    title: "Healthy-Me",
    summary:
      "An AI nutrition tracker that cross-checks two vision models against the same food photo for 99%+ accuracy.",
    description:
      "Most food-logging apps rely on manual entry or a single vision model that struggles with mixed plates. Healthy-Me runs two AI models against the same photo — Gemini for contextual recognition and a MobileNet model via TensorFlow.js for on-device classification — and reconciles them, landing at 99%+ accuracy on food identification.\n\nThe rest of the stack runs on Firebase: Auth for sign-in, Firestore for meal history, and Storage for photos, with an analytics dashboard for tracking meals over time. Code-splitting the dual-model pipeline cut the initial bundle size by 60%.",
    role: "Full-stack developer",
    year: 2025,
    status: "shipped",
    featured: true,
    stack: ["React 19", "TypeScript", "Firebase", "Gemini AI", "TensorFlow.js"],
    links: [
      { label: "Live", url: "https://healthy-me-psi.vercel.app", kind: "live" },
      { label: "Source", url: "https://github.com/Anubhavick/Healthy-Me", kind: "repo" },
    ],
  },
  {
    id: "proj-meta-tales",
    slug: "meta-tales",
    title: "Meta Tales",
    summary:
      "A blockchain NFT marketplace giving writers and comic artists verifiable ownership and built-in royalties.",
    description:
      "Writers, poets, and comic artists publishing on platforms like Wattpad or Medium get visibility but no real ownership of their work and no reliable way to earn from it after the fact. Meta Tales turns a written piece into an ERC-721 NFT with a built-in EIP-2981 royalty standard, so creators keep earning as their work resells.\n\nContracts are deployed and verified across 7+ networks — including Ethereum, Polygon, and BSC — with 95%+ test coverage. IPFS handles content and metadata storage, and the Next.js frontend integrates MetaMask for wallet connection, network switching, and transaction tracking. It scored 98 on Lighthouse.",
    role: "Full-stack & smart contract developer",
    year: 2025,
    status: "shipped",
    featured: true,
    stack: ["Solidity", "Next.js", "TypeScript", "Wagmi", "IPFS", "Hardhat"],
    links: [{ label: "Source", url: "https://github.com/Anubhavick/Meta-Tales", kind: "repo" }],
  },
  {
    id: "proj-cloud-security-ai",
    slug: "cloud-security-ai",
    title: "cloud-security-ai",
    summary:
      "An ML threat-detection platform paired with Terraform-automated Oracle Cloud infrastructure, built for a hackathon.",
    description:
      "Built for Oracle's 2025 hackathon: a monorepo that pairs a Random Forest model for network threat detection with infrastructure-as-code for the cloud it runs on. The FastAPI backend serves inference asynchronously in under 100ms, the model catches threats at 85%+ accuracy, and Terraform scripts stand up the full Oracle Cloud Infrastructure — VCN, compute, object storage — in about 5 minutes.\n\nDocker images were trimmed by 60% to keep deploys fast on a hackathon clock.",
    role: "Backend & ML developer",
    year: 2025,
    status: "shipped",
    featured: false,
    stack: ["Python", "FastAPI", "TensorFlow", "Docker", "Terraform", "Oracle Cloud"],
    links: [{ label: "Source", url: "https://github.com/Anubhavick/cloud-security-ai", kind: "repo" }],
  },
  {
    id: "proj-web-canvas",
    slug: "web-canvas",
    title: "WebCanvas",
    summary:
      "A Chrome extension that overlays a full drawing canvas on any webpage, with an AI region-analysis assist.",
    description:
      "Sketching an idea on top of a live webpage usually means a screenshot and a separate editor. WebCanvas overlays a full drawing surface directly on any site — freehand pen, shapes, and resize/rotate on drawn elements — while a browse mode lets you tab back into the underlying page without losing the annotations. The canvas auto-expands on infinite-scroll pages and persists to local storage between sessions.\n\nA Gemini integration lets you select a region and ask the AI to explain or analyze it, drawing and page content together.",
    role: "Developer",
    year: 2025,
    status: "in-progress",
    featured: false,
    stack: ["TypeScript", "Vite", "Chrome Extension APIs", "Gemini API"],
    links: [{ label: "Source", url: "https://github.com/Anubhavick/web-canvas", kind: "repo" }],
  },
  {
    id: "proj-serene-minds",
    slug: "serene-minds-by-injeela",
    title: "Serene Minds by Injeela",
    summary: "A marketing site for Injeela's psychology practice.",
    description:
      "A freelance build for Serene Minds, a psychology practice run by Injeela — a clean, calm web presence for prospective clients to learn about the practice and get in touch.",
    role: "Freelance developer",
    year: 2025,
    status: "shipped",
    featured: false,
    stack: ["React", "TypeScript", "Vite"],
    links: [{ label: "Live", url: "https://serene-minds-by-injeela.vercel.app", kind: "live" }],
  },
  {
    id: "proj-oh-architecture",
    slug: "oh-architecture",
    title: "OH Architecture",
    summary: "A portfolio site for the OH Architecture firm.",
    description:
      "A freelance build for OH Architecture, giving the firm a portfolio site to present its projects online.",
    role: "Freelance developer",
    year: 2025,
    status: "shipped",
    featured: false,
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    links: [{ label: "Live", url: "https://architecture-2-chi.vercel.app", kind: "live" }],
  },
  {
    id: "proj-gkc-architecture",
    slug: "gkc-architecture-tribute",
    title: "GKC Architecture Tribute",
    summary: "A portfolio/tribute site built around GKC Architecture's work.",
    description:
      "A freelance build presenting GKC Architecture's work — an independent site from the OH Architecture project above, for a different client.",
    role: "Freelance developer",
    year: 2025,
    status: "shipped",
    featured: false,
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    links: [{ label: "Live", url: "https://arhitrchure-1.vercel.app", kind: "live" }],
  },
  {
    id: "proj-somnath-air-conditioner",
    slug: "somnath-air-conditioner",
    title: "Somnath Air Condition",
    summary:
      "A local-service site for a Delhi NCR AC repair and installation business.",
    description:
      "A freelance build for Somnath Air Condition, an AC repair, servicing, gas-refill, and installation business covering Rohini Sector 9, Sector 24, and the wider Delhi NCR area — built to give a same-day-service local business a real web presence with clear service info and a direct way to get in touch.",
    role: "Freelance developer",
    year: 2025,
    status: "shipped",
    featured: false,
    stack: ["React", "TypeScript", "Vite"],
    links: [{ label: "Live", url: "https://www.somnathairconditioner.in", kind: "live" }],
  },
  {
    id: "proj-type-safe-router-gen",
    slug: "type-safe-router-gen",
    title: "type-safe-router-gen",
    summary:
      "A CLI that generates type-safe navigation helpers for file-based frontend routers — 300+ weekly npm downloads.",
    description:
      "A file-based router like Next.js's App Router is type-safe once you're inside a page, but the string paths passed to a Link or a router.push call aren't checked against the actual route tree — a typo'd path fails at runtime, not compile time. type-safe-router-gen is a CLI that scans the App Router folder structure and generates typed navigation helpers, plus route-level analytics and performance auditing on top.\n\nIt sees 300+ weekly downloads on npm.",
    role: "Creator & maintainer",
    year: 2025,
    status: "shipped",
    featured: false,
    stack: ["TypeScript", "Node.js", "Next.js"],
    links: [
      { label: "npm", url: "https://www.npmjs.com/package/type-safe-router-gen", kind: "other" },
      { label: "Source", url: "https://github.com/Anubhavick/type-safe-router-gen", kind: "repo" },
    ],
  },
  {
    id: "proj-type-mock-server",
    slug: "type-mock-server",
    title: "type-mock-server",
    summary:
      "Zero-config, type-safe mock APIs generated straight from TypeScript types — 200+ weekly npm downloads.",
    description:
      "Building against an API that doesn't exist yet usually means hand-writing a mock server or reaching for a heavyweight tool with its own config format. type-mock-server takes existing TypeScript types or schemas and spins up a zero-config mock API that matches their shape exactly, with no separate mock definitions to keep in sync by hand.\n\nIt sees 200+ weekly downloads on npm.",
    role: "Creator & maintainer",
    year: 2025,
    status: "shipped",
    featured: false,
    stack: ["TypeScript", "Node.js"],
    links: [
      { label: "npm", url: "https://www.npmjs.com/package/type-mock-server", kind: "other" },
      { label: "Source", url: "https://github.com/Anubhavick/type-mock-server", kind: "repo" },
    ],
  },
];

projects.forEach((project) => projectSchema.parse(project));
