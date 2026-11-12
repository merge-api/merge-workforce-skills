# Contributing

Thanks for your interest in contributing to the Merge Workforce skills.

## Reporting issues

If you've found a bug, want to request a new skill or feature, or have a question, please open an issue using the provided templates. For security issues, see [SECURITY.md](SECURITY.md) and do not file a public issue.

## Submitting changes

1. Fork the repository and create a topic branch from `main`.
2. Make focused, well-scoped changes. One concern per pull request keeps review tractable.
3. Run the prompt build locally to check that every skill still builds:
   ```bash
   bun scripts/prompts.ts --out dist
   ```
4. Open a pull request using the provided template. Describe what changed and why, and link any related issue.

## Skill conventions

- Skill files live under `mfw-skills/<skill-name>/SKILL.md`.
- Front-matter `name` must match the folder name, and `description` must be one line that says when to invoke the skill.
- Front-matter includes `license: MIT`.
- Step 1 of every skill is the same connection check. The build script fails if one copy drifts from the others.
- Skills ask before they write anything to a connected app.

## Code of Conduct

By participating, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).
