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
1. Check connections first. For each connector below, confirm it is signed in and that you can use the tools this skill needs there. Access can be granted per tool, so check the tools, not just the connector. Sort each one:
   - Needs sign-in: tell the user how to connect it.
   - Needs access: name the tools that are missing and how to get them.
   - Ready: carry on.
   How to check:
   - On Agent Handler: run the connector's validate_credential tool; a reauth_required error names the authenticate tool to give the user. Then run search_tools with connector_slugs set to the connector and an intent naming what this skill does there. Tools listed only under `requestable_tools` need access: offer to request exactly those with request_tool_access, and send the request only on the user's yes.
   - Elsewhere: use your setup's connection status if it has one; otherwise make this skill's first read call on each connector and sort by the error it returns.
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
