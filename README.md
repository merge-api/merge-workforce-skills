# MFW skills

Twenty skills for everyday work across the tools a company already runs on: briefings, meeting prep, CRM follow-ups, PR nudges, ticket triage, and more. Each skill is a `SKILL.md` an AI agent follows step by step, and each one asks before it writes anything.

They're written for [Merge Agent Handler](https://www.merge.dev/agent-handler). One Agent Handler connection gives your agent every connector a skill needs, with access granted tool by tool and every call logged. The skills also run on other setups that have the same connectors; the first step of each one explains how to check access either way.

## Copy a prompt

Every skill is also a prompt you can paste into any agent, in a chat app or in Claude Code. The prompt is the skill's `SKILL.md` without its YAML header, plus one line telling the agent to run it. Print one and copy it:

```bash
bun scripts/prompts.ts morning-plan | pbcopy
```

`node scripts/prompts.ts` works the same on Node 22.18 or later. Run it with no skill name to list them all.

Pasting a prompt doesn't install anything or grant any access. The prompt's first step checks what the agent can already reach, in this order: Agent Handler tools connected over MCP, the Merge CLI if the agent can run shell commands, then any other tools it has for the same apps. If none of those are there, the agent explains how to connect for the client it's running in and waits for you to sign in. A chat app can't run terminal commands, so skills that need a code checkout, such as Alert triage to fix PR, say when the work has to move to a coding agent.

For a website or another build, write every prompt to one JSON file of `slug`, `description` and `prompt`:

```bash
bun scripts/prompts.ts --out dist
```

`dist/` is build output and is ignored by git. To change a prompt, edit the skill's `SKILL.md` and rebuild. The script fails if a skill is missing its header or if one skill's connection step has drifted from the others.

## Connect Agent Handler

The prompts use whichever of these you have.

- **Your company uses Agent Handler for employees:** connect your AI client to `https://ah-api.merge.dev/mcp` and sign in through SSO. In Claude Code, run `claude mcp add --transport http agent-handler https://ah-api.merge.dev/mcp`, then `/mcp` to sign in. In Claude on the web or desktop, an org admin adds the URL as a custom connector, then each person connects it under [Connectors](https://claude.ai/customize/connectors). Other clients, and the admin setup, are in Merge's [Agent Handler for Employees guide](https://docs.merge.dev/merge-agent-handler/setup/agent-handler-for-employees).
- **A terminal agent:** install the [Merge CLI](https://docs.merge.dev/merge-agent-handler/build/cli/merge-cli) with `pipx install merge-api` and sign in with `merge login`. The agent finds tools with `merge search-tools` and runs them with `merge execute-tool`.
- **You're building with your own Tool Pack:** in the Agent Handler dashboard, create a Tool Pack with the connectors the skills you want use (see the table below), and a Registered User for the person running them. Create an access key for the same environment as the user (test keys with test users, production keys with production users). Then add Agent Handler to your AI tool as an MCP server at `https://ah-api.merge.dev/api/v1/tool-packs/<TOOL_PACK_ID>/registered-users/<REGISTERED_USER_ID>/mcp`, with the access key as a Bearer token in the `Authorization` header. Client-by-client config is in Merge's [MCP integration guide](https://docs.merge.dev/merge-agent-handler/build/connecting-agents/mcp-integration). Keep the key in your client config; don't paste it into a prompt.

When a connector isn't signed in or a tool needs an access request, the skill says so before it starts and names the step to fix it.

## Install a skill

To keep a skill around instead of pasting it each time, install it. Each folder in `mfw-skills/` is one skill.

- **Any agent the [skills CLI](https://github.com/vercel-labs/skills) supports, Claude Code included:** `npx skills add MatthewFeroz/mfw-skills --skill morning-plan`. `npx skills use MatthewFeroz/mfw-skills@morning-plan | claude` runs one skill once without installing it. Both read this repo from GitHub, and while it's private they only work for people with access to it.
- **Claude Code by hand:** copy the folder into `~/.claude/skills/` (all projects) or `.claude/skills/` in a repo.
- **Claude apps:** zip the folder and upload it under Settings → Capabilities → Skills.

## The skills

| Skill | What it does | Needs |
|---|---|---|
| [Morning plan](mfw-skills/morning-plan/SKILL.md) | One-screen briefing of what needs you today | Slack, Gmail, Google Calendar |
| [Meeting prep brief](mfw-skills/meeting-prep-brief/SKILL.md) | Brief on the people in your next external meeting | Google Calendar |
| [Meeting notes to tasks](mfw-skills/meeting-notes-to-tasks/SKILL.md) | Decisions and action items from a recording, filed as tasks | A recorder, a task tracker |
| [Find a time](mfw-skills/find-a-time/SKILL.md) | Slots that work for everyone, booked once you pick | Google Calendar or Outlook |
| [1:1 prep](mfw-skills/one-on-one-prep/SKILL.md) | Before each 1:1, what happened and one move to make | Google Calendar |
| [Deck from docs](mfw-skills/deck-from-docs/SKILL.md) | An approved outline turned into a slide deck | Google Slides, Gamma or Canva |
| [Post-call follow-up](mfw-skills/post-call-follow-up/SKILL.md) | Call summary, CRM note and follow-up email draft | A call recorder |
| [At-risk deal scan](mfw-skills/at-risk-deal-scan/SKILL.md) | Open deals ranked by risk, with evidence | A CRM, Gong |
| [Battlecard refresh](mfw-skills/battlecard-refresh/SKILL.md) | New dated battlecard version from won and lost deals | A doc store, a CRM, a call recorder |
| [CRM data hygiene audit](mfw-skills/crm-hygiene-audit/SKILL.md) | Missing fields and stale deals, one nudge per owner | A CRM, Slack |
| [Stale PR nudger](mfw-skills/stale-pr-nudger/SKILL.md) | PRs waiting on review, one nudge per reviewer | GitHub, Slack or Teams |
| [Release notes](mfw-skills/release-notes/SKILL.md) | Release notes from merged PRs between two releases | GitHub or GitLab |
| [Alert triage to fix PR](mfw-skills/alert-triage-to-fix-pr/SKILL.md) | Impact of a Sentry alert, plus a draft fix PR | Sentry, Slack, GitHub |
| [Ticket triage](mfw-skills/ticket-triage/SKILL.md) | New tickets sorted by severity, topic and owner | A help desk |
| [Renewal and usage brief](mfw-skills/renewal-and-usage-brief/SKILL.md) | Contract history next to usage: expand, hold or at risk | A CRM, Google Drive or Notion |
| [Email campaign builder](mfw-skills/email-campaign-builder/SKILL.md) | A campaign built, segmented and scheduled | HubSpot, Klaviyo, SendGrid or ActiveCampaign |
| [Deep research](mfw-skills/deep-research/SKILL.md) | A cited report across many sources | Exa, Firecrawl |
| [Interview prep](mfw-skills/interview-prep/SKILL.md) | A brief on today's candidates, aimed at gaps in earlier feedback | An ATS, Google Calendar |
| [Access request review](mfw-skills/access-request-review/SKILL.md) | Access requests checked against role and peers | ServiceNow or Jira Service Management, Okta |
| [Vendor bill review](mfw-skills/vendor-bill-review/SKILL.md) | Bills due, overdue, and possible duplicates | NetSuite or QuickBooks Online |

Each skill's first step lists its full required and optional connectors.
