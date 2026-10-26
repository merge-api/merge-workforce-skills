---
name: ticket-triage
description: "Classify, prioritize, and route incoming support tickets in the team's help desk. Use when the user says 'triage the queue', 'what came in overnight', or asks to prioritize or route new support tickets."
---

# ticket-triage

## When to use
- User asks to triage new or unassigned tickets in their help desk.
- User wants incoming tickets classified by urgency, topic, or team.
- User asks "what needs attention in the support queue" or similar.
- User pasted a batch of new ticket IDs and wants them classified and routed.

## Steps
1. Check connections first. For each connector below, run its validate_credential tool, and run Agent Handler search_tools with connector_slugs set to it and an intent naming what this skill does there (for example "search open deals", "create a note"). Access is granted per tool, and a connector's tools can show up in search before anyone has signed in, so sort by both results:
   - Needs sign-in: validate_credential fails (for example reauth_required). Give the user the authenticate tool the error names, such as authenticate_salesforce.
   - Needs access: a tool this skill needs comes back only under `requestable_tools`. Offer to request exactly those tools with request_tool_access, and send the request only on the user's yes.
   - Ready: validate_credential succeeds and the tools this skill needs come back under `tools`.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: one help desk (zendesk, freshdesk, intercom, front, zohodesk, pylon, jira_service_management, or servicenow). Optional: none. Stop if no help desk is ready.
2. Confirm which help desk the user runs. If more than one of the listed connectors is authenticated, ask rather than guessing.
3. Find the list-tickets or list-issues tool on that connector via Agent Handler tool search (for example: find the list-issues tool on the pylon connector). Fetch open tickets with no assignee or no priority, newest first. Cap at 50 per pass; if more exist, say so and offer another pass.
4. For each ticket, read subject and latest message. Classify on three axes:
   - Severity: outage or blocking, degraded, question, feature request.
   - Topic: pick from the help desk's existing tags or categories if the connector exposes a list-tags tool; do not invent new categories.
   - Route: which team or assignee group should own it, based on topic.
5. If a ticket mentions data loss, security, or a named enterprise account, mark it for immediate human review instead of auto-classifying.
6. Present the full triage table to the user and ask which updates to apply. Do not write anything yet.
7. After explicit confirmation, find the update-ticket tool on the same connector and apply priority, tags, and assignee for the approved rows only. Batch in groups of 10 and report failures per ticket.

## Output
- A table sorted by proposed severity: ticket ID, subject, requester, age, proposed severity, proposed topic, proposed route.
- A one-line count summary: total triaged, how many urgent, how many flagged for human review.
- Tickets flagged for human review listed separately with the phrase that triggered the flag.
- After writes: a confirmation list of ticket IDs updated and any that failed.

## Anti-patterns
- Never update, assign, or close a ticket before the user approves the specific changes.
- Do not fetch full conversation history for every ticket; subject plus latest message is enough for triage.
- Do not invent priority schemes; use the levels the help desk already defines.
- Do not reply to customers. Triage is internal only.
