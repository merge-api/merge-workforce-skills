---
name: morning-plan
description: "Morning digest of unread messages, today's calendar, and assigned work. Use when the user says 'morning briefing', 'what's on my plate today', or asks to catch up after time away."
---

# daily-briefing

## When to use
- User asks for their morning or start-of-day summary.
- User returns from PTO or a long stretch of meetings and wants to catch up.
- User asks what needs their attention today across chat, mail, calendar, and tasks.
- User asks for an end-of-day wrap; same shape with the window flipped to today.

## Steps
1. Check connections first. For each connector below, confirm it is signed in and that you can use the tools this skill needs there. Access can be granted per tool, so check the tools, not just the connector. Sort each one:
   - Needs sign-in: tell the user how to connect it.
   - Needs access: name the tools that are missing and how to get them.
   - Ready: carry on.
   How to check:
   - On Agent Handler: run the connector's validate_credential tool; a reauth_required error names the authenticate tool to give the user. Then run search_tools with connector_slugs set to the connector and an intent naming what this skill does there. Tools listed only under `requestable_tools` need access: offer to request exactly those with request_tool_access, and send the request only on the user's yes.
   - Elsewhere: use your setup's connection status if it has one; otherwise make this skill's first read call on each connector and sort by the error it returns.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: slack, gmail, google_calendar. Optional: asana, linear. Stop only if slack, gmail, and google_calendar are all not ready.
2. Set the window: since the user's last briefing or yesterday evening by default; for "back from vacation", ask the start date. All fetches below share this window and run in parallel.
3. Chat: find the unread-messages tools on the slack connector (unread DMs and unread channel messages). Summarize per conversation; pull only messages in the window, capped at 15 conversations.
4. Mail: find the list-messages tool on the gmail connector, filtered to unread in the window, capped at 30. Classify into needs-reply versus FYI from metadata and snippets; open full bodies only when a snippet is not enough to classify.
5. Calendar: find the list-events tool on the google_calendar connector for today. Note the first event time, gaps, and any event with external attendees.
6. Tasks: find the list-assigned-tasks or my-issues tools on the asana and linear connectors. Surface items due today or overdue, plus anything newly assigned in the window.
7. Rank across sources: direct asks of the user first (DMs and needs-reply mail), then today's meetings needing prep, then due or overdue tasks, then FYI items. Flag collisions, such as a due task with no free calendar slot.
8. If a source is disconnected or errors, skip it and note the gap rather than failing the whole briefing.
9. Keep it read-only. If the user asks to act on an item (reply, reschedule, complete a task), hand that to the matching skill or tool flow with its own confirmation.

## Output
- A briefing in four short sections: Needs you (direct asks with source links), Today's calendar (times and one-line context), Work due (task, tracker, due date), FYI (two-line max each).
- Total length under one screen; details on request, not by default.
- Counts of anything truncated by caps, so nothing disappears silently.
- A link on every item so the user can jump straight to the thread, event, or task.
- Skipped or erroring sources named, so gaps are visible.

## Anti-patterns
- Do not send replies, mark items read, or complete tasks as part of the briefing; it is read-only.
- Do not dump raw message lists; every item gets a one-line synthesis.
- Do not fetch whole channel histories; unread within the window only.
- Do not repeat items already briefed yesterday unless their state changed.
