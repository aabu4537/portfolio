export const identity = {
  name: "ALAM BUSHARA",
  role: "QUALITY DATA ENGINEER",
  email: "alam.bushara@gmail.com",
  linkedin: "https://www.linkedin.com/in/alambushara",
  github: "https://github.com/aabu4537",
};

export const intro = {
  headline:
    "Data engineer building production pipelines for defense manufacturing, driven by a love for innovation.",
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
      "Developed Python data pipelines and transformations in Palantir Foundry code repositories, integrating enterprise production and quality data to power automated reporting, non-conformance analysis, and reliability monitoring.",
      "Built Foundry ontologies unifying engineering, manufacturing, and quality data to support the accelerated production ramp of advanced seeker systems.",
      "Shipped operational apps and AI workflows with Foundry AIP and LLMs to automate quality investigations and accelerate root cause analysis.",
      "Enforced data governance, RBAC, and security policies across sensitive engineering systems, ensuring audit compliance and integrity of production-critical data assets.",
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
    club: "GROOVE BEVERAGES INC.",
    date: "MAY 2023 \u2013 JUNE 2025",
    role: "Co-Founder & CTO",
    location: "Boulder, CO",
    bullets: [
      "Co-founded a beverage startup, contributing to product formulation and company direction from inception.",
      "Designed, built, and deployed the company's public-facing website (HTML, CSS, JavaScript), owning the full stack from development through production hosting, domain infrastructure, and ongoing maintenance.",
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
    card: "4+ years. Analytics pipelines, the Raumdeuter Poisson engine, SDR tooling at NSA. First name on the team sheet.",
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
    card: "Production REST backends for data-driven applications. Raumdeuter itself runs zero-backend, client-side only.",
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
  "C++, TypeScript/Next.js, React, Node.js, REST APIs, HTML, CSS, Bash/Shell, Pandas/NumPy, scikit-learn, XGBoost, Tableau, Power BI, MongoDB, SPC, RCCA, AS9100, Agile";

export const project = {
  name: "RAUMDEUTER",
  competition: "THE OFF-BALL ENGINE \u2022 WORLD CUP 2026",
  url: "https://raumdeuter.vercel.app",
  github: "https://github.com/aabu4537/raumdeuter",
  stats: [
    { value: "0.184 BRIER", label: "Vs. 0.25 coin-flip baseline" },
    { value: "5/6", label: "2026 knockout favorites called correctly" },
    { value: "33 TESTS", label: "Pytest + Vitest coverage" },
  ],
  bullets: [
    "Built a Python ETL pipeline ingesting StatsBomb open-data match events (2022 World Cup, 16 matches) into per-90 percentile player ratings, validated by 22 pytest unit tests over the aggregation logic.",
    "Engineered a DOM-free JavaScript prediction engine (Dixon-Coles adjusted Poisson, tunable on/off-ball \u03b1 blend) with an exact analytical bracket solver replacing Monte Carlo simulation, recomputing championship odds client-side in real time and covered by an 11-test property-based Vitest suite.",
    "Validated the engine against real historical results and six pre-committed 2026 knockout predictions (each frozen before kickoff): 0.184 Brier score vs. a 0.25 coin-flip baseline, with 5 of 6 favorite calls correct.",
  ],
  stack: ["Python", "JavaScript", "React", "StatsBomb", "Vitest"],
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
