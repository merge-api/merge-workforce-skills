---
name: post-call-follow-up
description: "Summarizes a sales call, logs it to the CRM, and drafts the follow-up email. Use when the user says 'write the follow-up for my Acme call', 'log this call', or 'what were the next steps from today's call'."
---

# post-call-followup

## When to use
- A sales or customer call just happened and the user wants the follow-up handled.
- User asks for action items or next steps from a specific call.
- User wants the call summary logged against the CRM record.
- User asks for the follow-up email drafted from what was actually discussed.

## Steps
1. Find the call. Check the recording source the user names; otherwise try gong first (get_calls filtered to the user and date, then get_call), falling back to the list-recordings tool on fireflies, granola, or plaud. If several calls match, list them and ask.
2. Get the content. Prefer the source's AI summary or brief; pull the full transcript only when the summary lacks decisions, numbers, or owners you need.
3. Extract from the content:
   - Attendees, purpose, key points, and objections raised.
   - Commitments made by each side.
   - Next steps with owners and dates; mark anything not stated in the call as unknown and never infer due dates.
4. Match the CRM record. On hubspot, search_contacts and search_deals by attendee emails; on salesforce, the equivalent search tools. If no record matches, tell the user instead of creating one unprompted.
5. Show the user the package: call summary, the note text to log, and the follow-up email draft (recipients from actual attendees, subject, body with next steps).
6. On explicit confirmation, log the note to the CRM (find the create-note or log-activity tool for the matched record) and create tasks for next steps if the user wants them (create_task on hubspot or salesforce).
7. Send the email only after the user approves the final text and recipients. On gmail, prefer create_draft; use send_message only when the user explicitly says send.

## Output
- Call summary: 5 bullets max, plus a next-steps list with owner and date (or TBD).
- The logged CRM note link and any created task IDs.
- The email as sent or drafted, with recipients shown.

## Anti-patterns
- Do not send email or write CRM records without explicit confirmation of the exact content.
- Do not invent commitments, dates, or attendees not present in the call source.
- Do not log the raw transcript to the CRM; log the distilled note.
- Do not email anyone who was not on the call unless the user adds them deliberately.
