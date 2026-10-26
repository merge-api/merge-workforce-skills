# MFW skills

Twenty skills for everyday work across the tools a company already runs on: briefings, meeting prep, CRM follow-ups, PR nudges, ticket triage, and more. Each skill is a `SKILL.md` an AI agent follows step by step, and each one asks before it writes anything.

They're written for [Merge Agent Handler](https://www.merge.dev/agent-handler). One Agent Handler connection gives your agent every connector a skill needs, with access granted tool by tool and every call logged. The skills also run on other setups that have the same connectors; the first step of each one explains how to check access either way.

## Set up Agent Handler

1. In the Agent Handler dashboard, create a Tool Pack with the connectors the skills you want use (see the table below), and a Registered User for the person running them.
2. Create an access key for the same environment as the user (test keys with test users, production keys with production users).
3. Add Agent Handler to your AI tool as an MCP server. The URL is `https://ah-api.merge.dev/api/v1/tool-packs/<TOOL_PACK_ID>/registered-users/<REGISTERED_USER_ID>/mcp`, with the access key as a Bearer token in the `Authorization` header.

Client-by-client config for Claude Desktop, Cursor, Windsurf and VS Code is in Merge's [connect MCP guide](https://docs.merge.dev/get-started/connect-mcp). When a connector isn't signed in or a tool needs an access request, the skill says so before it starts and names the step to fix it.

## Add a skill

Each folder in `mfw-skills/` is one skill.

- **Claude Code:** copy the folder into `~/.claude/skills/` (all projects) or `.claude/skills/` in a repo.
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
