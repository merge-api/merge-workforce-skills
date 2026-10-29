# Building the prompts

`prompts.ts` turns each skill's `SKILL.md` into a prompt you can paste into any agent. The prompt is the `SKILL.md` without its YAML header, plus one line telling the agent to run it. `SKILL.md` stays the only source.

Print one prompt, or run with no skill name to list them all:

```bash
bun scripts/prompts.ts morning-plan | pbcopy
```

`node scripts/prompts.ts` works the same on Node 22.18 or later.

## For the website

```bash
bun scripts/prompts.ts --out dist
```

This writes:

- `dist/prompts.json`: every individual workflow prompt as `slug`, `description` and `prompt`
- `dist/get-started.md`: a copy of the onboarding prompt
- `dist/use-cases/workforce-use-cases.md`: the list of workflows and the apps each one needs
- `dist/use-cases/<skill>.md`: each workflow's full prompt

Publish the catalog at `https://www.merge.dev/ai-workflow-templates` and each workflow at `https://www.merge.dev/ai-workflow-templates/<skill>`, using the existing skill slug, such as `morning-plan` or `meeting-prep-brief`. The generated list contains all 20 full page URLs. Use the Markdown files as page content; the public URLs have no `.md` extension. Each workflow page needs its full prompt available as readable text for agents to follow.

These are the planned Webflow paths. Updating the links here does not publish the pages; verify them after publication before launching the onboarding prompt.

`dist/` is build output and is ignored by git. Edit `get-started.md` or a skill's `SKILL.md`, then rebuild. The script fails if a skill is missing its header or if one skill's connection step has drifted from the others.
