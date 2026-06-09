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
  /** Hero supporting line — current focus. */
  subline: string;
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
    "I build full-stack tools with strong backend foundations — APIs, automation systems, and data-driven workflows that are reliable, testable, and easy to use.",
  subline:
    "Recently focused on authentication, FastAPI, Postgres, testing, and turning messy technical problems into reliable software.",
  links: {
    github: "https://github.com/ericshark",
    linkedin: "https://www.linkedin.com/in/eric-zwierzynski/",
  },
};

export const projects: Project[] = [
  {
    name: "Authentication & Authorization API",
    date: "March 2026",
    stack: ["FastAPI", "PostgreSQL", "Redis", "Pytest"],
    description:
      "A pluggable authentication backend supporting JWT, session auth, OAuth, two-factor authentication, refresh token rotation, and role-based access control.",
    details: [
      "Designed a pluggable auth architecture using the Strategy pattern — JWT and session auth share one interface and swap via configuration, without touching route handlers.",
      "Implemented refresh token rotation with reuse detection and token-family revocation.",
      "Built TOTP two-factor authentication with QR enrollment and hashed backup codes.",
      "Added Redis-backed account lockout before database access to reduce brute-force load.",
    ],
    url: "https://github.com/ericshark/authentication-authorization-api.git",
  },
  {
    name: "Portfolio Optimizer Dashboard",
    date: "November 2025",
    stack: ["React", "Python", "FastAPI", "PostgreSQL", "Pytest", "Docker"],
    description:
      "A full-stack dashboard for running portfolio optimization models and visualizing risk, allocation, and historical stock data.",
    details: [
      "Implemented Mean-Variance, Kelly, and Vol-Targeting optimization workflows.",
      "Stored and queried historical stock price data in PostgreSQL.",
      "Containerized the full app with Docker Compose for local orchestration.",
      "Built React and Plotly views that make quantitative outputs readable.",
    ],
    url: "https://github.com/ericshark/Stock-Sense.git",
  },
];

export const experience: Experience[] = [
  {
    role: "Software Developer Intern",
    org: "GeoComm",
    location: "Remote",
    period: "May 2025 – Sep 2025",
    stack: ["Python", "FastAPI", "SQLAlchemy", "SQL", "Apache Airflow"],
    description:
      "Backend systems for public safety GIS applications supporting emergency response workflows.",
    details: [
      "Developed custom Airflow DAGs to automate recurring workflows and reduce manual tasks.",
      "Wrote 40+ Pytest unit tests, increasing coverage from 32% to 90%.",
      "Added structured logging to improve incident triage and backend observability.",
      "Refactored backend code for readability, performance, and maintainability.",
    ],
  },
  {
    role: "Software Engineering Program Participant",
    org: "Google G-SWEP",
    location: "New York, NY",
    period: "Jan 2024 – May 2025",
    stack: ["Python"],
    description:
      "Mentorship program — worked with a Google engineering mentor on algorithms, data structures, system design, and software engineering practices.",
  },
  {
    role: "Software Developer Intern",
    org: "Research Foundation of CUNY",
    location: "New York, NY",
    period: "Feb 2024 – May 2024",
    stack: ["JavaScript", "React", "Next.js", "Node.js", "OpenAI API"],
    description:
      "Built an internship-finder web app and AI-assisted discovery tools for student career exploration.",
    details: [
      "Designed and built an internship-finder web app using React, Next.js, Node.js, and the OpenAI API.",
      "Integrated intelligent search and recommendation features to help students discover relevant internships.",
      "Collaborated on outreach projects explaining AI and cryptography to non-technical audiences.",
    ],
  },
  {
    role: "Computer Science Teaching Assistant",
    org: "CUNY, College of Staten Island",
    location: "Staten Island, NY",
    period: "Jan 2025 – May 2025",
    stack: ["Python", "C++"],
    description:
      "Supported students in debugging, programming fundamentals, loops, data structures, and lab assignments.",
    compact: true,
  },
  {
    role: "Mathematics & Computer Science Tutor",
    org: "CUNY, College of Staten Island",
    location: "Staten Island, NY",
    period: "Sep 2024 – May 2025",
    stack: ["Python", "Java", "JavaScript", "C++"],
    description:
      "Tutored students in calculus, algebra, data structures, and programming across Python, Java, JavaScript, and C++.",
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
      "Coordinated construction project workflows, documentation, task progress, and team communication using Procore and Excel.",
    compact: true,
  },
];

export const stackLine =
  "Mostly working with Python, FastAPI, PostgreSQL, Redis, Docker, Pytest, React, TypeScript, SQLAlchemy, Pandas, NumPy, and Linux.";

export const siteMeta = {
  title: "Eric Zwierzynski — Software Engineer",
  description:
    "Software engineer in New York building backend-heavy systems, automation tools, and full-stack products. Focused on authentication, FastAPI, Postgres, and testing.",
};
