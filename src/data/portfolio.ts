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

export type Project = {
  name: string;
  category: string;
  date: string;
  stack: string[];
  description: string;
  highlights: string[];
  /** Curated highlights — keep to 3–4 readable bullets. */
  details: string[];
  /** Optional repository link. Omit rather than invent. */
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
    "I like knowing how the whole system works, from the database to the interface, and lately, the model in the middle.",
  contactHeadline:
    "Have a project, role, or technical problem in mind? Reach out.",
  availability: "Open to opportunities",
  about: {
    title: "A little about me",
    paragraphs: [
      "I’ve spent much of the past year following my curiosity down the stack. I like understanding how each layer works before deciding how the pieces should fit together.",
      "It started on the frontend with React, TypeScript, responsive design, and motion. From there I moved into Python and FastAPI backends: API and schema design, PostgreSQL, auth, caching, and background jobs. Then I wanted to see what sits underneath the app, so I started deploying my own projects with Docker, Nginx, a VPS, DNS, and TLS.",
      "Lately I’ve been bringing that same systems thinking to AI applications: how RAG, tools, memory, agent loops, tracing, and evals fit together around the model. I also build with agents every day, using Claude Code and Codex with my own skills and checks to move faster without cutting corners.",
    ],
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
    name: "Agent Tracer",
    category: "AI agent observability",
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
    name: "AuthCore",
    category: "Identity & access API",
    date: "June 2026",
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
      "Helped keep commercial interior construction projects organized by coordinating daily work across trades and subcontractors. I maintained project documents and schedules, keeping teams informed about upcoming work and changes.",
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
