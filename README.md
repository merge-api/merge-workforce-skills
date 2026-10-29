# Merge Workforce skills

Twenty ready-made workflows an AI agent runs across your company's apps: a morning briefing, meeting prep, CRM follow-ups, PR nudges, ticket triage and more. They connect through [Merge Agent Handler](https://www.merge.dev/agent-handler), and each one asks before it writes anything.

## Get started

Paste [`get-started.md`](get-started.md) into your AI agent. It asks about your role, connects you to Agent Handler, suggests workflows that fit the apps you can use, and runs the first one with you.

If you already know the workflow you want, copy its prompt and paste it into any agent:

```bash
bun scripts/prompts.ts morning-plan | pbcopy
```

Or install it as a skill so it's there next time:

```bash
npx skills add merge-api/merge-workforce-skills --skill morning-plan
```

You can also copy a folder from `mfw-skills/` into `~/.claude/skills/`, or zip it and upload it in the Claude apps under Settings → Capabilities → Skills.

## Connect Agent Handler

Each workflow checks its access in step 1 and tells you what to connect if something's missing.

- **Claude Code:** `claude mcp add --transport http agent-handler https://ah-api.merge.dev/mcp`, then `/mcp` to sign in.
- **Other terminal agents:** `pipx install merge-api`, then `merge login`.
- **Claude on the web, other clients, or your own Tool Pack:** see the [Agent Handler for Employees guide](https://docs.merge.dev/merge-agent-handler/setup/agent-handler-for-employees) and the [MCP integration guide](https://docs.merge.dev/merge-agent-handler/build/connecting-agents/mcp-integration).

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

Building the prompts for the website is covered in [`scripts/README.md`](scripts/README.md).
