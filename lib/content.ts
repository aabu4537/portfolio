export const identity = {
  name: "ALAM BUSHARA",
  role: "QUALITY DATA ENGINEER",
  email: "alam.bushara@gmail.com",
  linkedin: "https://www.linkedin.com/in/alambushara",
  github: "https://github.com/aabu4537",
};

export const intro = {
  headline:
    "Data engineer building production pipelines for defense manufacturing. World Cup predictions on the side.",
  body: "I'm a Quality Data Engineer at Boeing Defense, Space & Security, where I build Palantir Foundry ontologies, pipelines, and AI-powered workflows that keep advanced production programs on track. Previously: software at the NSA, performance engineering at SB Energy. CU Boulder CS grad.",
  tags: ["PALANTIR FOUNDRY", "PYTHON / SQL", "FOUNDRY AIP", "ETL / PIPELINES"],
};

export interface Fixture {
  club: string;
  date: string;
  role: string;
  location: string;
  bullets: string[];
}

export const fixtures: Fixture[] = [
  {
    club: "BOEING DEFENSE, SPACE & SECURITY",
    date: "NOV 2025 \u2013 PRESENT",
    role: "Quality Data Engineer",
    location: "Huntsville, AL",
    bullets: [
      "Developed Palantir Foundry ontologies unifying engineering, manufacturing, and quality data to support the accelerated production ramp of advanced seeker systems.",
      "Built SQL data pipelines in Pipeline Builder powering automated reporting, non-conformance analysis, and reliability monitoring.",
      "Shipped operational apps and AI workflows with Foundry AIP and LLMs to automate quality investigations and accelerate root cause analysis.",
      "Enforced data governance, RBAC, and security policies across sensitive engineering systems.",
    ],
  },
  {
    club: "SB ENERGY",
    date: "MAY 2025 \u2013 OCT 2025",
    role: "Performance Engineering Intern",
    location: "Denver, CO",
    bullets: [
      "Built Python analytics pipelines monitoring utility-scale solar performance from high-frequency time-series data, automating KPI reporting and degradation detection.",
      "Processed large-scale drone thermal and visual datasets into Git-managed production workflows for real-time anomaly detection.",
    ],
  },
  {
    club: "NATIONAL SECURITY AGENCY",
    date: "AUG 2024 \u2013 MAY 2025",
    role: "Software Intern",
    location: "Boulder, CO",
    bullets: [
      "Engineered an open-source Software-Defined Radio toolkit for digital signal and protocol analysis, enhancing RF threat detection.",
      "Built PyQt5 real-time signal visualization with FFT analysis and multithreaded processing.",
      "Cut training time 10%, saving $400K+ per recruit by streamlining core software workflows.",
    ],
  },
];

export interface Player {
  skill: string;
  position: string;
  line: "atk" | "mid" | "def" | "gk";
  kit: string;
  kit2: string;
  shorts?: string;
  skin: string;
  card: string;
}

export const squad: Player[] = [
  {
    skill: "FOUNDRY",
    position: "Playmaker",
    line: "atk",
    kit: "#D82800",
    kit2: "#F8F8F8",
    skin: "#8D5524",
    card: "Ontologies, Pipeline Builder, data governance. Daily driver at Boeing: unifying engineering, manufacturing, and quality data.",
  },
  {
    skill: "PYTHON",
    position: "Striker",
    line: "atk",
    kit: "#D82800",
    kit2: "#F8D800",
    skin: "#C68642",
    card: "4+ years. Analytics pipelines, the Raumdeuter Elo engine, SDR tooling at NSA. First name on the team sheet.",
  },
  {
    skill: "AIP / LLM",
    position: "Winger",
    line: "atk",
    kit: "#D82800",
    kit2: "#F8F8F8",
    skin: "#E0AC69",
    card: "AI-powered quality workflows in Foundry AIP: automated investigations and root cause analysis.",
  },
  {
    skill: "SQL",
    position: "Engine room",
    line: "mid",
    kit: "#F8D800",
    kit2: "#101040",
    shorts: "#101040",
    skin: "#C68642",
    card: "Postgres, SQL Server, MySQL, Oracle. Pipelines, transformations, non-conformance analysis.",
  },
  {
    skill: "ETL",
    position: "Box-to-box",
    line: "mid",
    kit: "#F8D800",
    kit2: "#101040",
    shorts: "#101040",
    skin: "#8D5524",
    card: "Idempotent ingestion, data modeling, and integration. From drone thermal data to enterprise quality systems.",
  },
  {
    skill: "FASTAPI",
    position: "Distributor",
    line: "mid",
    kit: "#F8D800",
    kit2: "#101040",
    shorts: "#101040",
    skin: "#E0AC69",
    card: "Production REST backends. Powers Raumdeuter's 10K-sim Monte Carlo forecasts in under 2 seconds.",
  },
  {
    skill: "REDIS",
    position: "Full-back",
    line: "def",
    kit: "#58B8F8",
    kit2: "#F8F8F8",
    skin: "#C68642",
    card: "Caching layer. The overlapping run that makes everything faster.",
  },
  {
    skill: "POSTGRES",
    position: "Centre-back",
    line: "def",
    kit: "#58B8F8",
    kit2: "#F8F8F8",
    skin: "#E0AC69",
    card: "Schema design, Alembic migrations, SQLAlchemy. Reads the game, never rushed.",
  },
  {
    skill: "DOCKER",
    position: "Centre-back",
    line: "def",
    kit: "#58B8F8",
    kit2: "#F8F8F8",
    skin: "#8D5524",
    card: "Reproducible environments and deploys. Nothing gets past it in the same place twice.",
  },
  {
    skill: "CI/CD",
    position: "Full-back",
    line: "def",
    kit: "#58B8F8",
    kit2: "#F8F8F8",
    skin: "#E0AC69",
    card: "Git-managed production workflows, automated checks, disciplined releases.",
  },
{
    skill: "GIT + LINUX",
    position: "Last line",
    line: "gk",
    kit: "#101040",
    kit2: "#F8D800",
    shorts: "#101040",
    skin: "#C68642",
    card: "Version control, shell scripting, and the calm at the back every stack is built on.",
  },
];

export const bench =
  "C++, TypeScript/Next.js, React, Node.js, Pandas/NumPy, scikit-learn, XGBoost, Tableau, Power BI, MongoDB, SPC, RCCA, AS9100";

export const project = {
  name: "RAUMDEUTER",
  competition: "WORLD CUP 2026 MATCH PREDICTOR",
  stats: [
    { value: "47K+", label: "Intl matches trained on" },
    { value: "10K", label: "Monte Carlo sims" },
    { value: "<2s", label: "Full tournament forecast" },
  ],
  bullets: [
    "Custom Elo engine with neutral-venue adjustment, recency decay, and soft-ceiling compression that corrects rating inflation in traditional Elo models.",
    "Production backend: FastAPI, PostgreSQL, Redis caching, Alembic migrations, idempotent ETL.",
    "Next.js/TypeScript frontend with interactive pressing heatmaps and percentile-ranked player grades from a possession-adjusted defensive metric built on StatsBomb tracking data.",
  ],
  stack: ["Python", "FastAPI", "PostgreSQL", "Redis", "Next.js", "TypeScript"],
};

export const education = {
  school: "University of Colorado Boulder",
  degree: "B.S. Computer Science, Minor in Business Analytics (May 2025)",
  honors: "Sachs Foundation Scholar \u2022 CU Esteemed Scholar \u2022 NSBE \u2022 Startup Summer",
};

export const modes = [
  { label: "CAREER MODE", sub: "EXPERIENCE", target: "career" },
  { label: "SQUAD SELECT", sub: "SKILLS", target: "squad" },
  { label: "HIGHLIGHTS", sub: "PROJECTS", target: "highlights" },
  { label: "FRIENDLIES", sub: "CONTACT", target: "friendlies" },
];
