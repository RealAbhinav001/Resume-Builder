// ATS-style keyword match between a resume and a job description.
// Score = matched keyword weight / total keyword weight * 100.
// Known skills (SKILLS) weigh 2; other words the job description repeats weigh 1.

const SKILLS = {
  javascript: ["javascript", "js", "es6"],
  typescript: ["typescript", "ts"],
  python: ["python"],
  java: ["java"],
  "c++": ["c\\+\\+", "cpp"],
  "c#": ["c#", "csharp"],
  go: ["golang"],
  sql: ["sql"],
  html: ["html", "html5"],
  css: ["css", "css3"],
  react: ["react", "react\\.js", "reactjs"],
  "next.js": ["next\\.js", "nextjs"],
  angular: ["angular"],
  vue: ["vue", "vue\\.js", "vuejs"],
  redux: ["redux", "redux toolkit"],
  tailwind: ["tailwind", "tailwindcss", "tailwind css"],
  "node.js": ["node", "node\\.js", "nodejs"],
  express: ["express", "express\\.js", "expressjs"],
  nestjs: ["nestjs", "nest\\.js"],
  django: ["django"],
  flask: ["flask"],
  "spring boot": ["spring boot", "springboot"],
  "rest api": ["rest", "restful", "rest api", "rest apis"],
  graphql: ["graphql"],
  mongodb: ["mongodb", "mongo"],
  mongoose: ["mongoose"],
  postgresql: ["postgresql", "postgres"],
  mysql: ["mysql"],
  redis: ["redis"],
  prisma: ["prisma"],
  docker: ["docker"],
  kubernetes: ["kubernetes", "k8s"],
  aws: ["aws", "amazon web services"],
  azure: ["azure"],
  gcp: ["gcp", "google cloud"],
  "ci/cd": ["ci/cd", "ci cd", "continuous integration"],
  git: ["git"],
  github: ["github"],
  linux: ["linux"],
  jwt: ["jwt", "json web token", "json web tokens"],
  oauth: ["oauth", "oauth2"],
  "socket.io": ["socket\\.io", "socketio", "websocket", "websockets"],
  jest: ["jest"],
  testing: ["testing", "unit testing", "unit tests"],
  "machine learning": ["machine learning", "ml"],
  openai: ["openai", "gpt", "llm", "llms"],
  puppeteer: ["puppeteer"],
  dsa: ["dsa", "data structures", "algorithms"],
  oop: ["oop", "oops", "object oriented", "object-oriented"],
  dbms: ["dbms"],
  agile: ["agile", "scrum"],
  microservices: ["microservices", "microservice"],
};

const STOP_WORDS = new Set(
  (
    "a an the and or but if then else of to in on at by for with from as is are was were be been being " +
    "this that these those it its we our you your they their he she i me my us them will would should can " +
    "could may might must shall do does did done have has had not no nor so than too very just also into " +
    "over under about across after before during between within without per via etc such other any all " +
    "each more most some what which who whom whose when where why how up out new well good great strong " +
    "work working works role team teams job candidate candidates experience experienced years year " +
    "ability able skills skill knowledge understanding looking required requirements preferred plus " +
    "responsibilities responsible including include includes using use used etc company opportunity " +
    "develop developing development build building design designing ensure help like based must-have"
  ).split(/\s+/),
);

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Matches a term only as a whole word, so "java" doesn't match "javascript"
// and "js" doesn't match the end of "node.js" (a dot before the term counts as part of a word).
const containsTerm = (text, pattern) =>
  new RegExp(`(^|[^a-z0-9+#.])(${pattern})(?![a-z0-9+#])`, "i").test(text);

const findSkills = (text) =>
  Object.keys(SKILLS).filter((skill) =>
    SKILLS[skill].some((alias) => containsTerm(text, alias)),
  );

const skillAliases = new Set(
  Object.values(SKILLS)
    .flat()
    .map((alias) => alias.replace(/\\/g, "")),
);

// Words the job description repeats (2+ times) that aren't stop words or known skills.
const findRepeatedTerms = (jobText) => {
  const counts = {};
  const words = jobText.toLowerCase().match(/[a-z][a-z0-9+#.-]*[a-z0-9+#]|[a-z]/g) || [];
  for (const word of words) {
    if (word.length < 3 || STOP_WORDS.has(word) || skillAliases.has(word)) continue;
    counts[word] = (counts[word] || 0) + 1;
  }
  return Object.keys(counts)
    .filter((word) => counts[word] >= 2)
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, 15);
};

export const analyzeResume = (resumeText, jobDescription) => {
  const jobSkills = findSkills(jobDescription);
  const resumeSkills = new Set(findSkills(resumeText));
  const terms = findRepeatedTerms(jobDescription);

  const keywords = [
    ...jobSkills.map((name) => ({ name, weight: 2, found: resumeSkills.has(name) })),
    ...terms.map((name) => ({
      name,
      weight: 1,
      found: containsTerm(resumeText, escapeRegex(name)),
    })),
  ];

  const total = keywords.reduce((sum, k) => sum + k.weight, 0);
  const matchedWeight = keywords.reduce((sum, k) => sum + (k.found ? k.weight : 0), 0);

  return {
    score: total === 0 ? 0 : Math.round((matchedWeight / total) * 100),
    matched: keywords.filter((k) => k.found).map((k) => k.name),
    missing: keywords.filter((k) => !k.found).map((k) => k.name),
    totalKeywords: keywords.length,
  };
};

// Flattens the builder's data into one block of text to search.
export const resumeToText = ({ userData = {}, points = [], certi = [] }) => {
  const parts = [
    userData.languages,
    userData.technologies,
    ...(userData.aboutProject || []).flatMap((p) => [
      p.projectName,
      p.projectDescription,
      p.techUsed,
    ]),
    ...(userData.aboutCertificate || []).flatMap((c) => [
      c.certificateName,
      c.certificateDescription,
    ]),
    ...(userData.aboutCollage || []).map((c) => c.collageDegree),
    points,
    certi,
  ];
  return parts.flat(Infinity).filter((part) => typeof part === "string").join(" \n ");
};
