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

export type Project = {
  name: string;
  date: string;
  stack: string[];
  description: string;
  /** Curated highlights — keep to 3–4 readable bullets. */
  details: string[];
  /** Optional. Omit rather than invent — absent links render as "Case study coming soon". */
  url?: string;
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
  about: {
    title: "A little about me",
    description:
      "I’m a full-stack engineer who likes figuring out how things fit together, from the backend to what people interact with. Lately, I’ve been especially interested in AI systems and the harnesses around them, and what makes them useful and dependable.",
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

export const projects: Project[] = [
  {
    name: "Agent Tracer — AI Agent Observability Platform",
    date: "August 2026",
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "React",
      "TypeScript",
      "OpenTelemetry",
    ],
    description:
      "A developer platform for debugging and understanding AI-agent executions: a Python SDK, a FastAPI ingest backend, and a React dashboard for inspecting every LLM and tool call.",
    details: [
      "Built an observability platform for AI agents: a Python SDK traces LLM and tool calls as nested spans, and an OTLP/HTTP endpoint ingests OpenTelemetry/OpenInference traces into a FastAPI and PostgreSQL backend.",
      "Developed a React/TypeScript dashboard with waterfall span timelines, per-step input/output/error inspection, and latency, token, and cost tracking, updated live via Server-Sent Events.",
      "Implemented side-effect-free replay of individual model calls against OpenAI/Anthropic, plus trace comparison that aligns span trees to surface status flips, drift, and latency/cost deltas.",
      "Added hashed API keys, Docker Compose, and GitHub Actions CI running 74 tests on SQLite and PostgreSQL.",
    ],
    url: "https://github.com/ericshark/agent-tracer",
  },
  {
    name: "AuthCore — Identity & Access API",
    date: "June 2026",
    stack: ["FastAPI", "PostgreSQL", "Redis", "Celery", "Docker", "Nginx"],
    description:
      "An open-source authentication and authorization backend: password, OAuth, and magic-link login, TOTP two-factor authentication, swappable JWT or session auth, and role-based access control.",
    details: [
      "Built an authentication and authorization API in FastAPI with JWT and Redis-backed sessions, OAuth2 (Google/GitHub), magic-link login, and TOTP 2FA with encrypted secrets and hashed backup codes.",
      "Designed a pluggable auth backend using the Strategy pattern, switching between JWT and session authentication via a single environment variable with shared login, logout, and revocation interfaces.",
      "Implemented refresh token rotation with reuse-family revocation, Argon2 password hashing, Redis-backed brute-force lockout with atomic operations, per-route RBAC, and per-device session management.",
      "Containerized FastAPI, Celery, PostgreSQL, and Redis with Docker Compose and Alembic migrations; covered 29 endpoints with 130+ pytest tests; previously deployed on a DigitalOcean VPS behind Nginx.",
    ],
    url: "https://github.com/ericshark/authentication-authorization-api",
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
      "Backend team at a public-safety GIS company whose software routes 9-1-1 calls and guides emergency responders for agencies in 49 states.",
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
      "Built an internship finder and AI career advisor for students on a 5-person team in a CUNY AI research lab.",
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
      "Coordinated daily workflows across trades and subcontractors on interior commercial construction projects, managing documentation in Procore and schedules in Microsoft Project and Excel; streamlined documentation to reduce scheduling delays by 25%.",
    compact: true,
  },
];

export const siteMeta = {
  title: "Eric Zwierzynski — Full-Stack Engineer",
  description:
    "Full-stack engineer in New York building software end to end — Python, FastAPI, PostgreSQL, React, and TypeScript.",
};
