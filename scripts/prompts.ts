// Builds each skill's copyable prompt from its SKILL.md, which stays the only source.
//   bun scripts/prompts.ts <skill>       print one prompt (pipe to pbcopy to copy it)
//   bun scripts/prompts.ts --out <dir>   write <dir>/prompts.json, the get-started prompt and
//                                        <dir>/use-cases/ (the list it reads, one file per skill)
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SKILLS_DIR = join(import.meta.dirname, "..", "mfw-skills");
const GET_STARTED = join(import.meta.dirname, "..", "get-started.md");
// Public Webflow page paths; the generated Markdown supplies their content.
const USE_CASES_URL = "https://www.merge.dev/ai-workflow-templates";

// A pasted prompt arrives with no "Use when" trigger, so it says up front to run the workflow.
const INTRO =
  "Use the workflow below for this conversation. Start at step 1, and ask me for anything it needs that I haven't given you, such as which meeting, account, or alert.\n\n";

type Skill = {
  slug: string;
  description: string;
  prompt: string;
  connectionStep: string;
  apps: string;
};

function load(slug: string): Skill {
  const text = readFileSync(join(SKILLS_DIR, slug, "SKILL.md"), "utf8");
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) throw new Error(`${slug}: SKILL.md has no YAML frontmatter`);
  const field = (key: string) => {
    const value = frontmatter[1].match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1].trim();
    return value?.startsWith('"') ? JSON.parse(value) : value;
  };
  if (field("name") !== slug) throw new Error(`${slug}: frontmatter name is "${field("name")}"`);
  const description = field("description");
  // Only one-line values are read; a YAML block scalar (> or |) would export as its marker.
  if (!description || /^[>|]/.test(description)) {
    throw new Error(`${slug}: frontmatter needs a one-line description`);
  }

  const body = text.slice(frontmatter[0].length).trim();
  const lines = body.split("\n");
  const start = lines.findIndex((line) => line.startsWith("1. Check connections first."));
  const end = lines.findIndex((line, i) => i > start && line.startsWith("   Required:"));
  if (start < 0 || end < 0) throw new Error(`${slug}: step 1 is not the connection check`);

  return {
    slug,
    description,
    prompt: INTRO + body + "\n",
    connectionStep: lines.slice(start, end).join("\n"),
    // "Required: ... Optional: ..." without the stop rules that follow.
    apps: lines[end]
      .trim()
      .split(/(?<=\.) /)
      .filter((sentence) => /^(Required|Optional):/.test(sentence))
      .join(" "),
  };
}

function loadAll(): Skill[] {
  const skills = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => load(entry.name))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  // Every skill carries the same connection guidance; catch a copy that drifted.
  const drifted = skills.filter((s) => s.connectionStep !== skills[0].connectionStep);
  if (drifted.length) {
    throw new Error(
      `step 1 differs from ${skills[0].slug} in: ${drifted.map((s) => s.slug).join(", ")}`,
    );
  }
  return skills;
}

const [arg, outDir] = process.argv.slice(2);
const skills = loadAll();

if (arg === "--out" && outDir) {
  mkdirSync(outDir, { recursive: true });
  const prompts = skills.map(({ slug, description, prompt }) => ({ slug, description, prompt }));
  writeFileSync(join(outDir, "prompts.json"), JSON.stringify(prompts, null, 2) + "\n");
  copyFileSync(GET_STARTED, join(outDir, "get-started.md"));

  const useCasesDir = join(outDir, "use-cases");
  mkdirSync(useCasesDir, { recursive: true });
  for (const { slug, prompt } of skills) writeFileSync(join(useCasesDir, `${slug}.md`), prompt);
  const list = skills.map(
    ({ slug, description, apps }) =>
      `## ${slug}\n\n${description}\n\nApps: ${apps}\n\nFull workflow: ${USE_CASES_URL}/${slug}\n`,
  );
  writeFileSync(
    join(useCasesDir, "workforce-use-cases.md"),
    "# Merge for Workforce use cases\n\nEach workflow runs on Merge Agent Handler. Apps lists the connectors it needs.\n\n" +
      list.join("\n"),
  );
  console.error(`Wrote ${prompts.length} prompts, get-started.md and use-cases/ to ${outDir}`);
} else {
  const skill = skills.find((s) => s.slug === arg);
  if (!skill) {
    console.error("Usage: bun scripts/prompts.ts <skill> | --out <dir>");
    console.error(`Skills: ${skills.map((s) => s.slug).join(", ")}`);
    process.exit(1);
  }
  process.stdout.write(skill.prompt);
}
