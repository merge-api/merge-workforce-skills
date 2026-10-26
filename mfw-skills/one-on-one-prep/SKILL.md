---
name: one-on-one-prep
description: Before each 1:1 on the manager's calendar, a short brief on that person's recent work - what happened, why it needs the manager, and one move to make. Use when the user says "prep me for my 1:1s", "prep me for my 1:1 with <name>", or on a weekday-morning schedule. Read-only. DRAFT, unpublished; output goes to chat, not email.
---

# one-on-one-prep (DRAFT)

## When to use
- "Prep me for my 1:1s today." / "Prep me for my 1:1 with <name> this afternoon."
- Scheduled weekday run before the manager's first 1:1.
- Not this skill: external meetings (use merge-meeting-prep-brief); group meetings.

## Steps
1. Check connections first. For each connector below, run its validate_credential tool, and run Agent Handler search_tools with connector_slugs set to it and an intent naming what this skill does there (for example "search open deals", "create a note"). Access is granted per tool, and a connector's tools can show up in search before anyone has signed in, so sort by both results:
   - Needs sign-in: validate_credential fails (for example reauth_required). Give the user the authenticate tool the error names, such as authenticate_salesforce.
   - Needs access: a tool this skill needs comes back only under `requestable_tools`. Offer to request exactly those tools with request_tool_access, and send the request only on the user's yes.
   - Ready: validate_credential succeeds and the tools this skill needs come back under `tools`.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: google_calendar. Optional: notion, asana, jira, linear, hubspot or salesforce, gong, slack, gmail. Stop if google_calendar is not ready.
2. Find 1:1s: google_calendar list_events for today (user's timezone), single_events=true.
   A 1:1 = not declined, exactly one other human attendee on the user's domain (ignore
   room resources), OR a title like "1:1", "1-1", "1v1", "<name> / <user>", "<name> + <user>".
   Prompt names a person -> take only that meeting. None today -> say "No 1:1s today" and stop.
3. Label each 1:1's relationship: direct report, manager, or peer. Use what's knowable:
   Slack/Google profile manager field if present; else signals (they organize the series
   AND the user's team meetings -> likely manager). Still unclear -> ask the user once,
   then reuse the answer. Never guess the org chart. Only brief 1:1s not yet started
   (if all are over, say so and offer "this week").
4. Per person (cap 5 per run), in parallel, last 14 days, read-only:
   - Work, across whatever is connected: Notion (search pages/databases they edited or
     are assigned/mentioned in), Asana (search_tasks assignee), Jira/Linear, CRM
     (Salesforce/HubSpot opps they own; Gong only for sales reps). Name sources that are
     not connected or empty in one line; don't ask which tool unless all are empty.
   - Signal: slack search_messages "from:<person>" and DMs with the user;
     gmail list_messages "from:<person> OR to:<person> newer_than:14d -subject:invitation"
     (metadata/snippets only).
   - Manager 1:1: look at the USER's own work instead (their wins, blockers, open asks
     from the manager) and produce a "What to bring up" brief, not a report review.
5. Pick the 3-5 items that matter most: blocked, overdue, slipping, waiting on the user,
   a decision needed, or a win worth naming. Drop routine noise.
6. Write each item as What happened / Why it needs you / Move. Cite the source inline.
7. Skip any source that is not connected or returns nothing; state the gap in one line.

## Output (chat, one block per 1:1, ordered by start time)
```
### <Name> - <meeting title>, <time>
Relationship: direct report | manager | peer (basis: profile field / signal / user said)
Sources: Notion (n), Slack (n), Gmail (n), ... | not available: ...
1. <Item> - What happened: ... [source, date]
   Why it needs you: ...
   Move: ...
Open loops: who owes whom a reply (max 3 bullets)
```
Manager 1:1 variant: "What to bring up" -> Wins (1-3), Blockers (0-3), Asks (0-3),
plus open loops the manager is waiting on. Each cited.
- Nothing substantial -> one line ("Nothing open needs you; use the time on <topic>").
  Never pad to fill a template.

## Rules
- Strictly read-only. No create/update/delete/send/post/draft calls, no marking read.
- Production delivery is one email to the manager only, never the report. DRAFT: chat only.
- Do not quote message bodies; summarize. No full transcripts or mailbox history.
- Do not invent work or bios when sources are empty; say the data is missing.
- Don't include personal or HR-sensitive content found incidentally in threads.
