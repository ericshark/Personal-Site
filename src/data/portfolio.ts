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
  /** Short availability status shown in the intro and contact sections. */
  availability: string;
  about: {
    title: string;
    paragraphs: string[];
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

export type ProjectMedia =
  /**
   * Pre-encoded screenshot. `src` is the extension-less base path; the capture
   * script writes `<src>-thumb` (homepage) and `<src>-media` (case study) in
   * AVIF and WebP.
   */
  | { type: "image"; src: string; alt: string }
  /** Designed, theme-aware visual drawn in code (no screenshot available). */
  | { type: "trace" | "auth" };

export type ArchitectureNode = {
  id: string;
  label: string;
  detail?: string;
  /** Row 0 is the main left-to-right path; row 1 hangs below `col` of row 0. */
  row: 0 | 1;
  col?: number;
  dashed?: boolean;
};

export type Architecture = {
  /** Text alternative describing the whole diagram. */
  alt: string;
  nodes: ArchitectureNode[];
  /** Each edge points from a node to the next row-0 node, or down to a row-1 node. */
  edges: { from: string; to: string; label?: string }[];
};

/** Homepage groups, in display order. */
export const projectKinds: { kind: Project["kind"]; label: string }[] = [
  { kind: "Engineering", label: "Engineering & AI Infrastructure" },
  { kind: "Product", label: "Products & Games" },
  { kind: "Visual", label: "Visual & Interactive" },
];

export type Project = {
  /** URL segment for /projects/<slug>. Unique. */
  slug: string;
  name: string;
  /** One sentence: homepage row and case-study subtitle. */
  oneLiner: string;
  category: string;
  kind: "Engineering" | "Product" | "Visual";
  year: string;
  stack: string[];
  media: ProjectMedia;
  /** Omit when not deployed, so no Live action renders. Never invent links. */
  live?: string;
  /** Omit when not public, so no GitHub action renders. */
  repo?: string;
  caseStudy: {
    /** 2–3 sentences: the problem and what it does. */
    summary: string;
    role: string;
    status?: string;
    /** 2–4 tiles. */
    metrics: { value: string; label: string }[];
    /** 0–4 cards. */
    decisions: { title: string; body: string }[];
    architecture?: Architecture;
    gallery?: { src: string; alt: string; caption?: string }[];
  };
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

export type Education = {
  degree: string;
  school: string;
  location: string;
  graduated: string;
  gpa: string;
  coursework: string[];
};

export const profile: Profile = {
  name: "Eric Zwierzynski",
  role: "Full-Stack Engineer · AI\u00a0Applications",
  location: "New York, NY",
  email: "ericzwierzynski1@gmail.com",
  headline:
    "I design and build software, from interactive experiences to AI-powered applications.",
  contactHeadline:
    "Have a project, role, or technical problem in mind? Reach out.",
  availability: "Open to opportunities",
  about: {
    title: "A little about me",
    paragraphs: [
      "I've always been curious about the whole process of bringing an idea to life. I enjoy everything from visual design, animations, and interactive experiences to building backend systems, exploring game design, and figuring out how to deploy it all. Along the way, I've worked across the stack with React, TypeScript, Python, FastAPI, and PostgreSQL. I like understanding how things work behind the scenes just as much as making them look and feel good.",
      "These days, I'm especially interested in AI applications. I use coding agents regularly, and I've been building and exploring the systems around LLMs, from tool calling and agent workflows to tracing and observability. What excites me most is combining AI, design, and engineering to turn ideas into polished, useful products that people enjoy using.",
    ],
    updated: {
      dateTime: "2026-11",
      label: "November 2026",
    },
  },
  links: {
    github: "https://github.com/ericshark",
    linkedin: "https://www.linkedin.com/in/eric-zwierzynski/",
  },
};

/**
 * Order matters: AI and backend work first, then product, then visual.
 * Case-study copy is drafted from each repo's README and needs owner review.
 */
export const projects: Project[] = [
  {
    slug: "agent-tracer",
    name: "Agent Tracer",
    oneLiner:
      "Observability and evals for AI agents: live timelines, model-call replay, run comparison, and scored experiments.",
    category: "AI agent observability & evals",
    kind: "Engineering",
    year: "2026",
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "React",
      "TypeScript",
      "OpenTelemetry",
    ],
    media: {
      type: "image",
      src: "/projects/agent-tracer",
      alt: "Agent Tracer landing page: the headline “See exactly what your agents did” above a dashboard of trace volume, error rate, p95 latency, and spend.",
    },
    live: "https://agent-tracer.ericzwierzynski.dev",
    repo: "https://github.com/ericshark/agent-tracer",
    caseStudy: {
      summary:
        "When an agent fails, the logs show that it failed, not why. Agent Tracer records every model call and tool call as a nested span, so you can find the step that went wrong, inspect its exact input and output, and re-run it. Evals then score runs against a dataset, so you can tell whether a change helped.",
      role: "Solo — design & build",
      status: "Live demo",
      metrics: [
        { value: "138", label: "tests across the SDK, API, and web app" },
        { value: "OTLP", label: "OpenTelemetry / OpenInference ingest" },
        { value: "25", label: "evaluators: code, tool-path, and LLM-judge" },
        { value: "~45 µs", label: "SDK overhead per span, measured locally" },
      ],
      architecture: {
        alt: "Architecture: the agent's Python SDK sends spans, or OTLP/HTTP JSON, to a FastAPI ingest service. The service upserts them into PostgreSQL and publishes Server-Sent Events to the React dashboard. Replay and evals call OpenAI, Anthropic, or an offline simulator; eval jobs are queued in PostgreSQL.",
        nodes: [
          {
            id: "sdk",
            label: "Agent app",
            detail: "Python SDK · batched",
            row: 0,
          },
          {
            id: "api",
            label: "FastAPI ingest",
            detail: "upsert · aggregate",
            row: 0,
          },
          {
            id: "ui",
            label: "React dashboard",
            detail: "waterfall · inspector",
            row: 0,
          },
          {
            id: "db",
            label: "PostgreSQL",
            detail: "traces · eval jobs",
            row: 1,
            col: 1,
          },
          {
            id: "llm",
            label: "OpenAI · Anthropic · simulator",
            row: 1,
            col: 2,
            dashed: true,
          },
        ],
        edges: [
          { from: "sdk", to: "api", label: "spans / OTLP" },
          { from: "api", to: "ui", label: "SSE after commit" },
          { from: "api", to: "db" },
          { from: "api", to: "llm", label: "replay · evals" },
        ],
      },
      decisions: [
        {
          title: "Spans are upserted, so the view is live",
          body: "The SDK sends a span when it starts and completes it later. The server upserts by (trace, span_id) and recomputes trace totals in one transaction; clients get an SSE event only after commit.",
        },
        {
          title: "Eval jobs queue in PostgreSQL, not a broker",
          body: "Experiments are claimed with FOR UPDATE SKIP LOCKED, retried with backoff, and re-queued if a worker crashes. Live updates use in-process pub/sub, so there is no Redis to run.",
        },
        {
          title: "Replay never has side effects",
          body: "Replay re-runs exactly one model call with recorded or edited input, stores attempts apart from the trace, and never executes tools. An offline simulator keeps it usable without provider keys.",
        },
        {
          title: "Comparison aligns span trees by (name, kind)",
          body: "Built for “this run failed, that one worked: what changed?”. It surfaces status flips, missing steps, input and output drift, and latency, token, and cost deltas.",
        },
      ],
    },
  },
  {
    slug: "authcore",
    name: "AuthCore",
    oneLiner:
      "An authentication API with swappable JWT/session strategies, OAuth, magic links, and 2FA.",
    category: "Identity & access API",
    kind: "Engineering",
    year: "2026",
    stack: ["FastAPI", "PostgreSQL", "Redis", "Celery", "Docker", "Nginx"],
    media: { type: "auth" },
    repo: "https://github.com/ericshark/authentication-authorization-api",
    caseStudy: {
      summary:
        "An open-source authentication backend with flexible sign-in flows, swappable auth strategies, and fine-grained access control. It covers password, OAuth2, magic-link, and TOTP two-factor sign-in behind one API.",
      role: "Solo — design & build",
      status: "Open source · previously deployed",
      metrics: [
        { value: "29", label: "API endpoints" },
        { value: "135", label: "pytest tests" },
        { value: "2", label: "auth strategies, switched by one env var" },
      ],
      architecture: {
        alt: "Architecture: clients reach a FastAPI service through Nginx. FastAPI stores users and roles in PostgreSQL, keeps sessions and lockout counters in Redis, and hands background work to Celery.",
        nodes: [
          { id: "client", label: "Client", detail: "web · mobile", row: 0 },
          { id: "nginx", label: "Nginx", detail: "reverse proxy", row: 0 },
          {
            id: "api",
            label: "FastAPI",
            detail: "JWT or session strategy",
            row: 0,
          },
          { id: "db", label: "PostgreSQL", detail: "users · roles", row: 0 },
          {
            id: "redis",
            label: "Redis",
            detail: "sessions · lockout",
            row: 1,
            col: 2,
          },
          {
            id: "celery",
            label: "Celery",
            detail: "background tasks",
            row: 1,
            col: 3,
          },
        ],
        edges: [
          { from: "client", to: "nginx" },
          { from: "nginx", to: "api" },
          { from: "api", to: "db" },
          { from: "api", to: "redis" },
          { from: "api", to: "celery" },
        ],
      },
      decisions: [
        {
          title: "Auth strategy is pluggable",
          body: "A Strategy pattern switches between JWT and session authentication with one environment variable. Login, logout, and revocation share the same interface.",
        },
        {
          title: "Refresh tokens rotate, and reuse revokes the family",
          body: "Each refresh issues a new token. Replaying an old one is treated as theft and revokes every token in that family.",
        },
        {
          title: "Brute-force lockout lives in Redis",
          body: "Failed-attempt counters use atomic operations, so concurrent guesses can’t slip past the limit. Passwords are hashed with Argon2.",
        },
        {
          title: "2FA secrets are encrypted at rest",
          body: "TOTP secrets are stored encrypted and backup codes are stored hashed, so a database leak doesn’t expose either.",
        },
      ],
    },
  },
  {
    slug: "world-observatory",
    name: "World Observatory",
    oneLiner:
      "A global dashboard for population, health, the economy, public debt, and emissions over a night-lights map.",
    category: "Data visualization",
    kind: "Product",
    year: "2026",
    stack: ["Next.js", "MapLibre GL", "three.js", "d3-geo"],
    media: {
      type: "image",
      src: "/projects/world-observatory",
      alt: "World Observatory dashboard: a night-lights world map coloured by population, with a signal library on the left and country rankings on the right.",
    },
    live: "https://world-observatory.ericzwierzynski.dev",
    repo: "https://github.com/ericshark/world-observatory",
    caseStudy: {
      summary:
        "Global statistics usually arrive as static tables. World Observatory puts population, health, the economy, public debt, and emissions on one night-lights map, so you can switch signals and compare countries in a single view.",
      role: "Solo — design & build",
      status: "Live",
      metrics: [
        { value: "217", label: "countries" },
        { value: "13", label: "signals" },
      ],
      decisions: [
        {
          title: "Headline figures are continuously estimated",
          body: "Counters such as population tick forward as live estimates, and the interface labels them as modelled rather than measured.",
        },
        {
          title: "One map, many signals",
          body: "Every signal shares the same map, legend, and country dossier, so switching what you’re looking at never means relearning the interface.",
        },
      ],
    },
  },
  {
    slug: "geopractice",
    name: "GeoGuessr Academy",
    oneLiner:
      "A course for recognizing GeoGuessr clues, scheduled per clue with spaced repetition.",
    category: "Learning app",
    kind: "Product",
    year: "2026",
    stack: ["React", "TypeScript", "Dexie", "FSRS", "Zod"],
    media: {
      type: "image",
      src: "/projects/geopractice",
      alt: "GeoGuessr Academy Learn page: a suggested first lesson on driving side, progress counters, and a curriculum of clue topics.",
    },
    live: "https://geo-guesser-practice.ericzwierzynski.dev",
    repo: "https://github.com/ericshark/geo-guesser-practice",
    caseStudy: {
      summary:
        "Getting good at GeoGuessr means remembering hundreds of small clues, from road lines and signs to languages, plates, and driving side. GeoGuessr Academy teaches them in short lessons, mixes them in practice, and brings each clue back when you’re about to forget it.",
      role: "Solo — design & build",
      status: "Live",
      metrics: [
        { value: "400", label: "clues" },
        { value: "93", label: "lessons in 15 topics" },
        { value: "FSRS", label: "per-clue scheduling" },
      ],
      decisions: [
        {
          title: "Scheduling is per clue, not per prompt",
          body: "FSRS schedules each clue across days at a 90% recall target. Every question shows a fresh example, so you learn the clue instead of memorizing one picture or sentence.",
        },
        {
          title: "Lessons stay short, look-alikes stay together",
          body: "A lesson teaches at most six clues. Practice mixes look-alikes, and wrong answers record which two clues you confuse so you can drill that pair.",
        },
        {
          title: "Progress lives in the browser",
          body: "The hosted app keeps progress in IndexedDB through Dexie, so there is no account to create.",
        },
      ],
    },
  },
  {
    slug: "humanrank",
    name: "HumanRank",
    oneLiner:
      "A human-performance arcade: twelve games for reflexes, memory, and focus, with honest stats.",
    category: "Browser games",
    kind: "Product",
    year: "2026",
    stack: ["React", "TypeScript", "Dexie", "Supabase", "PGlite"],
    media: {
      type: "image",
      src: "/projects/humanrank",
      alt: "HumanRank home screen: a “Find your strengths” card with a ring of six skill icons, a starter circuit of six games, and a daily challenge.",
    },
    live: "https://human-benchmark.ericzwierzynski.dev",
    repo: "https://github.com/ericshark/human-benchmark",
    caseStudy: {
      summary:
        "Most reaction-time sites show one number and little else. HumanRank groups twelve short games into six skills and keeps stats you can trust, starting with a seven-minute circuit that finds your strengths.",
      role: "Solo — design & build",
      status: "Live",
      metrics: [
        { value: "12", label: "games" },
        { value: "6", label: "skills" },
        { value: "Local", label: "history, no account needed" },
      ],
      decisions: [
        {
          title: "Accounts are optional",
          body: "Results stay in the browser, so every game works without signing in. The Supabase backend for accounts and population comparisons is built and optional; its SQL policies are tested with PGlite.",
        },
        {
          title: "Daily challenge is the same for everyone",
          body: "The daily set is shared, and its scores are kept separate from regular sessions so the two never mix.",
        },
      ],
    },
  },
  {
    slug: "world-game",
    name: "World Game",
    oneLiner:
      "A geography game on a 3D globe: lessons, daily puzzles, seven game modes, and ranked online duels.",
    category: "Multiplayer 3D geography game",
    kind: "Product",
    year: "2026",
    stack: [
      "React",
      "three.js",
      "TypeScript",
      "Node.js",
      "Hono",
      "WebSockets",
      "SQLite",
    ],
    media: {
      type: "image",
      src: "/projects/world-game",
      alt: "World Game home screen: Learn, Daily, Play, and Compete tabs beside a realistic 3D globe centred on the Americas.",
    },
    live: "https://world-game.ericzwierzynski.dev",
    repo: "https://github.com/ericshark/world-game",
    caseStudy: {
      summary:
        "A geography game built around a realistic 3D globe. Learn countries, capitals, flags, cities, and states with spaced review, solve daily puzzles, race the clock, or battle others in private rooms and ranked duels. Version 2.0 installs for offline solo and Learn play.",
      role: "Solo — design & build",
      status: "Live · v2.0",
      metrics: [
        { value: "7", label: "game modes" },
        { value: "523", label: "unit tests" },
        {
          value: "300",
          label: "simulated players in a local load test, 0 errors",
        },
        { value: "4 ms", label: "p95 move latency in that test" },
      ],
      decisions: [
        {
          title: "Game rules are pure and run anywhere",
          body: "Every mode is plain-JSON state with no clock, randomness or rendering inside. The browser hosts solo games and the Node server hosts battles and ranked play with the same code.",
        },
        {
          title: "The server is the referee",
          body: "Ranked dailies and battles send each player only what they’re allowed to see. A test plays every battle format to the end and checks each message for leaked answers.",
        },
        {
          title: "Quick Duel pairs players by Glicko-2 rating",
          body: "The search window starts at ±100 and widens by 25 each second. After 20 seconds it offers a labelled bot match, which never changes a rating.",
        },
        {
          title: "The globe loads fast and idles at zero",
          body: "Splitting the bundle cut JavaScript from 1,392 KB to 329 KB and phone first paint from 1.8 s to 0.6 s. The globe renders only on demand, so idle phone CPU fell from 6.5% to 0%.",
        },
      ],
    },
  },
  {
    slug: "journey-through-space",
    name: "Journey Through Space",
    oneLiner:
      "An interactive flight from Earth to the black hole Sagittarius A*, with 13 stops along the way.",
    category: "3D interactive journey",
    kind: "Visual",
    year: "2026",
    stack: ["three.js", "TypeScript", "GSAP", "Vite"],
    media: {
      type: "image",
      src: "/projects/journey-through-space",
      alt: "Journey Through Space opening stop: a rendered Earth against the Milky Way, with facts, distance from Earth, and a route of stops to Sagittarius A*.",
    },
    live: "https://journey-through-space.ericzwierzynski.dev",
    repo: "https://github.com/ericshark/journey-through-space",
    caseStudy: {
      summary:
        "Astronomical distances are hard to feel. Journey Through Space flies you from Earth to Sagittarius A*, about 26,000 light-years away. Inspect each world up close, take timed flights between stops, and finish with an optional descent past the event horizon.",
      role: "Solo — design & build",
      status: "Live",
      metrics: [
        { value: "13", label: "observation stops" },
        { value: "12", label: "timed flights" },
        { value: "26,000 ly", label: "to Sagittarius A*" },
      ],
      decisions: [
        {
          title: "Timed flights, not scroll",
          body: "Flights run on one pausable clock, so you can pause, skip, or fly back. Selecting a stop on the route jumps straight there.",
        },
        {
          title: "Science and visuals are modelled separately",
          body: "Distance and speed come from sourced, approximate positions. Visual space and flight times are compressed, and the route is a schematic, not a scale map.",
        },
        {
          title: "Rendering adapts to the device",
          body: "High, medium, and low quality tiers scale bloom, antialiasing, and the HDR pipeline to what the device can handle.",
        },
      ],
    },
  },
  {
    slug: "interface-explorations",
    name: "Interface Explorations",
    oneLiner:
      "Sixteen interaction studies in React and Motion: galleries, controls, and graphics.",
    category: "Motion & interaction",
    kind: "Visual",
    year: "2026",
    stack: ["React", "Motion", "TypeScript"],
    media: {
      type: "image",
      src: "/projects/interface-explorations",
      alt: "Interface Explorations: an images and galleries collection showing a 3D gallery carousel of flower photographs.",
    },
    live: "https://interaction-playground.ericzwierzynski.dev",
    repo: "https://github.com/ericshark/interaction-playground",
    caseStudy: {
      summary:
        "A workbench for interface details that are easy to get wrong: how a gallery turns, how a control responds, how a graphic moves. Each of the sixteen studies is a small, self-contained piece.",
      role: "Solo — design & build",
      status: "Ongoing",
      metrics: [
        { value: "16", label: "studies" },
        { value: "3", label: "collections" },
        { value: "2", label: "themes, light and dark" },
      ],
      decisions: [
        {
          title: "Studies are grouped into collections",
          body: "Images, widgets, and experiments each get their own tab, so related pieces sit together and stay easy to compare.",
        },
        {
          title: "Every study works in both themes",
          body: "Light and dark are built in from the start rather than added afterwards.",
        },
      ],
    },
  },
  {
    slug: "ai-under-the-hood",
    name: "AI Under the Hood",
    oneLiner:
      "An interactive lesson that follows one question from the Send button to the model and back, in eight stages.",
    category: "Interactive lesson",
    kind: "Visual",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Motion", "FastAPI"],
    media: {
      type: "image",
      src: "/projects/ai-under-the-hood",
      alt: "AI Under the Hood home screen: the headline “What happens when you ask AI a question?”, a question box with Demo and Live modes, and a list of eight stages.",
    },
    live: "https://ai-visualized.ericzwierzynski.dev",
    repo: "https://github.com/ericshark/ai-visualized",
    caseStudy: {
      summary:
        "Most explanations of how AI answers a question stay abstract. This lesson follows one real question through your browser, the app’s server, the AI provider and the model, animating each stage and keeping the technical detail behind a Go deeper panel.",
      role: "Solo — design & build",
      status: "Live demo",
      metrics: [
        { value: "8", label: "stages" },
        { value: "2", label: "modes, demo and live" },
        { value: "3", label: "data labels" },
      ],
      decisions: [
        {
          title: "Every visual says what it is",
          body: "Each is labelled Sample data, Measured or Simulation, with dashed outlines for things the API never exposes, so nothing illustrative passes as a measurement.",
        },
        {
          title: "Demo mode needs no API key",
          body: "Recorded sample runs play through the same event pipeline as live ones, so the lesson works for anyone, and Live mode is an opt-in extra.",
        },
        {
          title: "The API key never reaches the browser",
          body: "Live questions stream through a FastAPI backend with a rate limit, a daily cap and a concurrency cap. The browser only learns the model name.",
        },
      ],
    },
  },
];

export const experience: Experience[] = [
  {
    role: "Independent Software Engineer",
    org: "Full-Stack & AI Applications",
    location: "New York, NY",
    period: "Sep 2025 – Present",
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "React",
      "TypeScript",
      "Node.js",
    ],
    description:
      "Designing, building, and deploying my own full-stack and AI applications end to end, from interface and backend to testing and hosting.",
    details: [
      "Built 12 web apps and deployed 9 via CI/CD; self-hosted a FastAPI service on a VPS with Nginx and TLS.",
      "Engineered agentic coding workflows: repo-level context, reusable skills, parallel Git worktrees, and test gates.",
      "Implemented authentication and authorization: OAuth/PKCE, RBAC, 2FA, revocable sessions, and rate limiting.",
    ],
  },
  {
    role: "Software Developer Intern",
    org: "GeoComm",
    location: "Remote",
    period: "May 2025 – Sep 2025",
    stack: ["Python", "FastAPI", "Apache Airflow", "Pytest"],
    description:
      "Worked on backend software that helps emergency dispatch teams use accurate location data. I automated routine data checks, made service issues easier to investigate, and improved test coverage so the team could maintain its public-safety systems more confidently.",
    details: [
      "Built backend Python and FastAPI services powering public-safety GIS workflows for a 9-1-1 provider serving agencies in 49 states, processing real-time geospatial data to support accurate and timely emergency response routing.",
      "Developed Airflow DAGs to track whether required files were present across 100+ tenants, generating automated reports and reducing manual validation effort by ~30%.",
      "Added structured JSON logging with trace IDs across FastAPI services, cutting incident triage time by ~40%.",
      "Wrote 40+ pytest unit tests and refactored existing backend code, raising code coverage from 32% to 90%.",
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
  {
    role: "Software Developer Intern",
    org: "Research Foundation of CUNY, AI Research Lab",
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
      "Built a full-stack Next.js/TypeScript internship platform with keyword search, multi-filter sorting, and an application tracker used by 50+ students.",
      "Aggregated 1,000+ internship postings from GitHub internship lists and job sites into one searchable database.",
      "Integrated the OpenAI API to normalize postings into structured, searchable fields, auto-tag them by role, and power a GPT-based career advisor that gave students resume feedback.",
    ],
  },
];

export const education: Education = {
  degree: "B.S. in Computer Science, Cum Laude",
  school: "CUNY, College of Staten Island",
  location: "Staten Island, NY",
  graduated: "May 2025",
  gpa: "3.63 / 4.00",
  coursework: [
    "Data Structures & Algorithms",
    "Database Systems",
    "Operating Systems",
    "Computer Architecture",
    "Internet Data Communications & Security",
  ],
};

export const earlierExperience: Experience[] = [
  {
    role: "Project Manager Intern",
    org: "JRM Construction Management",
    location: "New York, NY",
    period: "May 2024 – Aug 2024",
    stack: [],
    description:
      "Helped keep commercial interior construction projects organized by coordinating daily work across trades and subcontractors. I maintained project documents and schedules, keeping teams informed about upcoming work and changes. Streamlining documentation processes cut scheduling delays by 25%.",
    compact: true,
  },
];

export const siteMeta = {
  // Set NEXT_PUBLIC_SITE_URL to the deployed URL so OG images and the sitemap resolve absolutely.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ericzwierzynski.dev",
  title: "Eric Zwierzynski — Full-Stack Engineer · AI Applications",
  description:
    "Full-stack engineer in New York building software end to end, now focused on AI applications — Python, FastAPI, PostgreSQL, React, and TypeScript.",
};
