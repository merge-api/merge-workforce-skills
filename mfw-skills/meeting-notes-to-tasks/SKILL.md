---
name: meeting-notes-to-tasks
description: "Pull meeting notes or transcripts, extract decisions and action items, and file tasks in the tracker. Use when the user says 'what were the action items', 'turn the meeting notes into tasks', or asks to file follow-ups from a call."
---

# meeting-notes-to-actions

## When to use
- User references a recorded meeting and wants decisions and action items extracted.
- User wants those action items filed as tasks in their tracker.
- User asks what was decided on a specific call.
- User wants decisions from several recent calls compiled into one log.

## Steps
1. Check connections first. For each connector below, run its validate_credential tool, and run Agent Handler search_tools with connector_slugs set to it and an intent naming what this skill does there (for example "search open deals", "create a note"). Access is granted per tool, and a connector's tools can show up in search before anyone has signed in, so sort by both results:
   - Needs sign-in: validate_credential fails (for example reauth_required). Give the user the authenticate tool the error names, such as authenticate_salesforce.
   - Needs access: a tool this skill needs comes back only under `requestable_tools`. Offer to request exactly those tools with request_tool_access, and send the request only on the user's yes.
   - Ready: validate_credential succeeds and the tools this skill needs come back under `tools`.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: one recording source (plaud, granola, fireflies, zoom, or google_meet); one tracker (asana, linear, or jira). Optional: none. Stop if no recording source is ready. With no tracker ready, extract and show the lists but file nothing.
2. Locate the recording: identify which capture tool holds it (plaud, granola, fireflies, zoom, or google_meet). If the user named the meeting but not the tool, search the tool they use most; find the list-recordings or search-meetings tool on that connector, filtered by date and title keyword.
3. Fetch the AI summary or notes first: find the get-note or get-summary tool on the connector. Fall back to the transcript (find the get-transcript tool) only when the summary is missing or lacks owners and dates.
4. Extract three lists: decisions (what was settled), action items (owner, item, due date), and open questions. Take owners and due dates only from the source; mark unknown owners as "?" and missing dates as "TBD". Do not infer commitments nobody made.
5. Confirm the tracker (asana, linear, or jira) and destination project. Map owners to tracker users via the connector's user-lookup tool; leave unmatched owners unassigned and say so.
6. Present the draft tasks (title, description with a quote from the notes, assignee, due date) plus the decision log. File nothing yet.
7. On explicit confirmation, find the create-task or create-issue tool on the tracker connector and file each task. Batch at most 20 tasks per meeting; more suggests over-extraction, so re-check with the user.
8. Report created task links grouped by assignee.
9. For multi-meeting sweeps, cap at 5 recordings per run and merge action items that repeat across meetings into one task with both sources cited.

## Output
- Decision log: numbered, each with the deciding quote or moment.
- Action items table: owner, item, due date, source recording.
- After filing: task IDs and links grouped by assignee; unassigned items flagged.
- Open questions listed separately so they are not filed as tasks.
- The source recording named on every extracted item.

## Anti-patterns
- Never file tasks without showing drafts and getting confirmation.
- Never invent owners or due dates; "?" and "TBD" are correct answers.
- Do not pull full transcripts when the summary suffices; transcripts are the largest payload.
- Do not create duplicate tasks; search the destination project for matching titles first.
