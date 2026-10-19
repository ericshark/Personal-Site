/**
 * All editable portfolio content lives in this file.
 * Components render from these objects — edit here, not in the components.
 */

export type Profile = {
  name: string;
  role: string;
  location: string;
  email: string;
  /** Hero headline — the one-sentence positioning statement. */
  headline: string;
  contactHeadline: string;
  about: {
    title: string;
    description: string;
    /** Manually update this date when revising the introduction. */
    updated: {
      dateTime: string;
      label: string;
    };
  };
  links: {
    github: string;
    linkedin: string;
  };
};

export type ProjectCategoryId = "interfaces" | "games" | "tools" | "lab";

export type ProjectCategory = {
  id: ProjectCategoryId;
  label: string;
  blurb: string;
};

/** Which code-drawn mock screenshot a card shows until a real `image` exists. */
export type PreviewVariant =
  | "trace"
  | "auth"
  | "terminal"
  | "dashboard"
  | "chart"
  | "board"
  | "orbit"
  | "letters"
  | "generative"
  | "waveform";

export type Project = {
  /** URL-safe id, used for /projects#slug deep links. */
  slug: string;
  name: string;
  category: ProjectCategoryId;
  /** Short free-text descriptor shown under the name. */
  kind: string;
  date: string;
  status: "shipped" | "in progress" | "concept";
  stack: string[];
  description: string;
  highlights: string[];
  /** Curated highlights — keep to 3–4 readable bullets. */
  details: string[];
  /** Optional repository link. Omit rather than invent. */
  url?: string;
  demoUrl?: string;
  /** Shown in the home page's Featured strip. */
  featured?: boolean;
  /** Footprint in the bento grid; defaults to "sm". */
  size?: "sm" | "wide" | "tall" | "lg";
  preview: PreviewVariant;
  /** Accent hue (0–360) for the preview. */
  hue: number;
  /** Real screenshot path under /public; replaces the code-drawn preview. */
  image?: string;
  /** Made-up placeholder content for this experimental branch. */
  sample?: boolean;
};

export type Experience = {
  role: string;
  org: string;
  location: string;
  period: string;
  stack: string[];
  description: string;
  /** Optional bullets for roles with concrete outcomes. */
  details?: string[];
  /** Render compactly (description only, tighter spacing). */
  compact?: boolean;
};

export const profile: Profile = {
  name: "Eric Zwierzynski",
  role: "Software Engineer",
  location: "New York, NY",
  email: "ericzwierzynski1@gmail.com",
  headline:
    "I build software end to end, from the database to the details people notice.",
  contactHeadline:
    "Have a project, role, or technical problem in mind? Reach out.",
  about: {
    title: "A little about me",
    description:
      "I like understanding how every layer of a system works, from the interface people use to the infrastructure underneath it. I’ve built across the stack and worked hands-on with deployment, Docker, Nginx, VPS hosting, DNS, and TLS along the way. Lately, I’ve been going deeper into AI application engineering, especially RAG, agent workflows, agent harnesses, observability, evals, and the UX around AI systems.",
    updated: {
      dateTime: "2026-10",
      label: "October 2026",
    },
  },
  links: {
    github: "https://github.com/ericshark",
    linkedin: "https://www.linkedin.com/in/eric-zwierzynski/",
  },
};

export const projectCategories: ProjectCategory[] = [
  {
    id: "interfaces",
    label: "Interfaces",
    blurb:
      "Dashboards and data-heavy UIs where the challenge is making a lot of information feel calm.",
  },
  {
    id: "games",
    label: "Games",
    blurb:
      "Small browser games for experimenting with physics, game loops, and input that feels right.",
  },
  {
    id: "tools",
    label: "Tools & Backends",
    blurb:
      "APIs, developer tools, and infrastructure: the parts of a product you only notice when they break.",
  },
  {
    id: "lab",
    label: "Lab",
    blurb:
      "Half-finished ideas and one-off experiments, kept around because they taught me something.",
  },
];

export const projects: Project[] = [
  {
    slug: "agent-tracer",
    name: "Agent Tracer",
    category: "tools",
    kind: "AI agent observability",
    date: "August 2026",
    status: "shipped",
    featured: true,
    size: "lg",
    preview: "trace",
    hue: 221,
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "React",
      "TypeScript",
      "OpenTelemetry",
    ],
    description:
      "A developer platform that makes AI-agent executions understandable, from the first model call to the last tool response.",
    highlights: [
      "Live timelines for every LLM and tool call",
      "Model-call replay and trace comparison",
    ],
    details: [
      "Built an observability platform for AI agents: a Python SDK traces LLM and tool calls as nested spans, and an OTLP/HTTP endpoint ingests OpenTelemetry/OpenInference traces into a FastAPI and PostgreSQL backend.",
      "Developed a React/TypeScript dashboard with waterfall span timelines, per-step input/output/error inspection, and latency, token, and cost tracking, updated live via Server-Sent Events.",
      "Implemented side-effect-free replay of individual model calls against OpenAI/Anthropic, plus trace comparison that aligns span trees to surface status flips, drift, and latency/cost deltas.",
      "Added hashed API keys, Docker Compose, and GitHub Actions CI running 74 tests on SQLite and PostgreSQL.",
    ],
    url: "https://github.com/ericshark/agent-tracer",
  },
  {
    slug: "authcore",
    name: "AuthCore",
    category: "tools",
    kind: "Identity & access API",
    date: "June 2026",
    status: "shipped",
    featured: true,
    size: "tall",
    preview: "auth",
    hue: 160,
    stack: ["FastAPI", "PostgreSQL", "Redis", "Celery", "Docker", "Nginx"],
    description:
      "An open-source authentication backend with flexible sign-in flows, swappable auth strategies, and fine-grained access control.",
    highlights: [
      "Password, OAuth, magic links, and two-factor auth",
      "Session security and role-based access control",
    ],
    details: [
      "Built an authentication and authorization API in FastAPI with JWT and Redis-backed sessions, OAuth2 (Google/GitHub), magic-link login, and TOTP 2FA with encrypted secrets and hashed backup codes.",
      "Designed a pluggable auth backend using the Strategy pattern, switching between JWT and session authentication via a single environment variable with shared login, logout, and revocation interfaces.",
      "Implemented refresh token rotation with reuse-family revocation, Argon2 password hashing, Redis-backed brute-force lockout with atomic operations, per-route RBAC, and per-device session management.",
      "Containerized FastAPI, Celery, PostgreSQL, and Redis with Docker Compose and Alembic migrations; covered 29 endpoints with 130+ pytest tests; previously deployed on a DigitalOcean VPS behind Nginx.",
    ],
    url: "https://github.com/ericshark/authentication-authorization-api",
  },

  // Sample projects below are placeholder content for the experimental
  // projects browser. Replace or delete each one (search for `sample: true`).
  {
    slug: "pulse",
    name: "Pulse",
    category: "interfaces",
    kind: "Real-time metrics dashboard",
    date: "September 2026",
    status: "in progress",
    featured: true,
    size: "wide",
    preview: "dashboard",
    hue: 262,
    sample: true,
    stack: ["React", "TypeScript", "D3", "WebSockets", "Tailwind CSS"],
    description:
      "A live operations dashboard that streams service metrics and keeps a busy screen readable at a glance.",
    highlights: [
      "Sub-second updates over WebSockets",
      "Panels that rearrange to fit what's on fire",
    ],
    details: [
      "Streams metrics over a single multiplexed WebSocket and batches renders to one per animation frame.",
      "Draws charts with D3 scales and plain SVG, keeping a fixed DOM size so long sessions don't slow down.",
      "Highlights anomalies with a rolling z-score and pins affected panels to the top of the grid.",
    ],
  },
  {
    slug: "ledgerline",
    name: "Ledgerline",
    category: "interfaces",
    kind: "Personal finance dashboard",
    date: "May 2026",
    status: "concept",
    preview: "chart",
    hue: 152,
    sample: true,
    stack: ["Next.js", "TypeScript", "Recharts", "SQLite"],
    description:
      "A spending dashboard that turns a CSV bank export into categories, trends, and a forecast you can drag.",
    highlights: [
      "Drag the forecast line to plan a budget",
      "Local-first: data never leaves the browser",
    ],
    details: [
      "Parses bank CSV exports in a Web Worker and auto-categorizes transactions with editable rules.",
      "Stores everything in SQLite compiled to WebAssembly, persisted to the Origin Private File System.",
      "Projects the next three months from recurring transactions and lets you adjust them directly on the chart.",
    ],
  },
  {
    slug: "tideboard",
    name: "Tideboard",
    category: "interfaces",
    kind: "Ocean & weather data viz",
    date: "March 2026",
    status: "shipped",
    size: "tall",
    preview: "chart",
    hue: 196,
    sample: true,
    stack: ["Svelte", "TypeScript", "Canvas", "NOAA API"],
    description:
      "Tide, swell, and wind forecasts for a handful of beaches, drawn as one layered timeline instead of five tables.",
    highlights: [
      "Seven-day tide curves with swell overlays",
      "Picks the best window to go out",
    ],
    details: [
      "Pulls tide predictions and buoy observations from public NOAA endpoints and caches them at the edge.",
      "Renders layered forecasts on Canvas with a shared time axis you can scrub with touch or keyboard.",
      "Scores each hour against your saved preferences and highlights the best session of the day.",
    ],
  },
  {
    slug: "gridlock",
    name: "Gridlock",
    category: "games",
    kind: "Sliding-block traffic puzzle",
    date: "July 2026",
    status: "shipped",
    featured: true,
    preview: "board",
    hue: 24,
    sample: true,
    stack: ["TypeScript", "Canvas", "Vite"],
    description:
      "A rush-hour puzzle game: slide the cars out of the way and get the red one to the exit in as few moves as possible.",
    highlights: ["120 hand-checked levels", "A solver that rates every level"],
    details: [
      "Built the game loop and input handling on a single Canvas, with pointer and keyboard controls.",
      "Wrote a breadth-first solver that finds the minimum move count and sorts levels by difficulty.",
      "Undo, redo, and replay are built on a compact move log, so shared solutions fit in a URL.",
    ],
  },
  {
    slug: "orbital",
    name: "Orbital",
    category: "games",
    kind: "Gravity slingshot game",
    date: "April 2026",
    status: "in progress",
    size: "wide",
    preview: "orbit",
    hue: 290,
    sample: true,
    stack: ["TypeScript", "WebGL", "Three.js"],
    description:
      "Launch a probe through a small solar system and use each planet's gravity to reach the target.",
    highlights: [
      "N-body physics at a fixed timestep",
      "Ghost trajectories preview each launch",
    ],
    details: [
      "Simulates gravity with a fixed-step Verlet integrator so runs are deterministic and replayable.",
      "Predicts the next few seconds of flight and draws them as a fading ghost path while aiming.",
      "Renders with Three.js and instanced meshes for particle trails.",
    ],
  },
  {
    slug: "wordloop",
    name: "Wordloop",
    category: "games",
    kind: "Daily word game",
    date: "January 2026",
    status: "shipped",
    preview: "letters",
    hue: 45,
    sample: true,
    stack: ["React", "TypeScript", "Cloudflare Workers"],
    description:
      "A daily puzzle where every answer starts with the last letter of the one before it.",
    highlights: ["One new loop every day", "Spoiler-free emoji results"],
    details: [
      "Generates each day's loop from a seeded word graph, so every player gets the same puzzle.",
      "Validates guesses at the edge with a compact trie and keeps streaks in local storage.",
    ],
  },
  {
    slug: "queuewatch",
    name: "Queuewatch",
    category: "tools",
    kind: "Job-queue inspector",
    date: "February 2026",
    status: "concept",
    size: "wide",
    preview: "terminal",
    hue: 130,
    sample: true,
    stack: ["Go", "Redis", "Bubble Tea", "PostgreSQL"],
    description:
      "A terminal UI for watching background job queues: what's running, what's stuck, and what keeps retrying.",
    highlights: [
      "Live view of Celery, Sidekiq, and BullMQ queues",
      "Retry or dead-letter jobs from the keyboard",
    ],
    details: [
      "Reads queue state directly from Redis with read-only commands, so it's safe to point at production.",
      "Groups failures by exception fingerprint and shows how often each one has retried.",
      "Ships as a single static Go binary with a Bubble Tea interface.",
    ],
  },
  {
    slug: "prompt-garden",
    name: "Prompt Garden",
    category: "lab",
    kind: "Generative visuals",
    date: "August 2026",
    status: "concept",
    size: "tall",
    preview: "generative",
    hue: 330,
    sample: true,
    stack: ["TypeScript", "SVG", "Claude API"],
    description:
      "Type a mood and a language model writes the rules for a small generative plant that grows on screen.",
    highlights: [
      "Prompts become L-system grammars",
      "Every plant can be exported as SVG",
    ],
    details: [
      "Asks the model for a structured L-system (axiom, rules, angle) and validates it before rendering.",
      "Grows the plant step by step in SVG, so you can watch the grammar expand.",
    ],
  },
  {
    slug: "latency-synth",
    name: "Latency Synth",
    category: "lab",
    kind: "Sonified network latency",
    date: "June 2026",
    status: "in progress",
    preview: "waveform",
    hue: 12,
    sample: true,
    stack: ["Web Audio API", "TypeScript", "WebSockets"],
    description:
      "Turns ping times into sound: a slow network literally sounds lower, and packet loss drops beats.",
    highlights: [
      "Each host gets its own voice",
      "Hear an outage before the graphs show it",
    ],
    details: [
      "Maps round-trip time to pitch and jitter to vibrato using Web Audio oscillators.",
      "Runs a small scheduler ahead of the audio clock so notes stay in time even when the tab is busy.",
    ],
  },
];

export const experience: Experience[] = [
  {
    role: "Software Developer Intern",
    org: "GeoComm",
    location: "Remote",
    period: "May 2025 – Sep 2025",
    stack: ["Python", "FastAPI", "Apache Airflow", "Pytest"],
    description:
      "Worked on backend software that helps emergency dispatch teams use accurate location data. I automated routine data checks, made service issues easier to investigate, and improved test coverage so the team could maintain its public-safety systems more confidently.",
    details: [
      "Built backend Python and FastAPI services powering public-safety GIS workflows for 9-1-1 dispatch, processing real-time geospatial data to support accurate and timely emergency response routing.",
      "Developed Airflow DAGs to track whether required files were present across all tenants, generating automated reports and reducing manual validation effort by ~30%.",
      "Added structured JSON logging with trace IDs across FastAPI services, cutting incident triage time by ~40%.",
      "Wrote 40+ pytest unit tests, increasing code coverage from 32% to 90%.",
    ],
  },
  {
    role: "Software Engineering Program Participant",
    org: "Google G-SWEP",
    location: "New York, NY",
    period: "Feb 2025 – May 2025",
    stack: [],
    description:
      "Competitively selected for Google's software engineering mentorship program; sharpened algorithms and system design through weekly 1:1 mentorship with a Google engineer, code reviews, and engineer-led workshops.",
  },
  {
    role: "Software Developer Intern",
    org: "Research Foundation of CUNY",
    location: "Queens, NY",
    period: "Jan 2024 – May 2024",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "OpenAI API",
    ],
    description:
      "Worked with a five-person research team to help students find internships and prepare their applications. I built tools for searching opportunities and tracking applications, along with an AI career advisor that offered resume feedback.",
    details: [
      "Built a full-stack Next.js/TypeScript internship platform with keyword search, multi-filter sorting, and an application tracker used by dozens of students.",
      "Aggregated scattered internship postings from GitHub internship lists and job sites into one searchable database.",
      "Integrated the OpenAI API to normalize postings into structured, searchable fields and power a GPT-based career advisor that gave students resume feedback.",
    ],
  },
  {
    role: "Computer Science Teaching Assistant",
    org: "CUNY, College of Staten Island",
    location: "Staten Island, NY",
    period: "Jan 2025 – May 2025",
    stack: ["Python", "Java", "JavaScript", "C++"],
    description:
      "Assisted a professor in coding labs of 25+ students, guiding hands-on exercises and helping students debug and understand Python, Java, JavaScript, and C++.",
    compact: true,
  },
  {
    role: "Mathematics & Computer Science Tutor",
    org: "CUNY, College of Staten Island",
    location: "Staten Island, NY",
    period: "Sep 2024 – May 2025",
    stack: ["Python", "Java", "JavaScript", "C++"],
    description:
      "Tutored 50+ students weekly (1,000+ sessions) in calculus, algebra, data structures, and programming in Python, Java, JavaScript, and C++; created practice sets and review checklists for exam prep.",
    compact: true,
  },
];

export const earlierExperience: Experience[] = [
  {
    role: "Project Manager Intern",
    org: "JRM Construction Management",
    location: "New York, NY",
    period: "May 2024 – Aug 2024",
    stack: [],
    description:
      "Helped keep commercial interior construction projects organized by coordinating daily work across trades and subcontractors. I maintained project documents and schedules, keeping teams informed about upcoming work and changes.",
    compact: true,
  },
];

export const siteMeta = {
  // Set NEXT_PUBLIC_SITE_URL to the deployed URL so OG images and the sitemap resolve absolutely.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ericzwierzynski.dev",
  title: "Eric Zwierzynski — Full-Stack Engineer",
  description:
    "Full-stack engineer in New York building software end to end — Python, FastAPI, PostgreSQL, React, and TypeScript.",
};
