---
name: interview-prep
description: "Brief the user on each candidate they interview today, with 3 to 5 questions aimed at gaps in earlier interview feedback. Use when the user says 'prep me for my interviews today', 'what did earlier interviewers not cover for X', or on a weekday-morning schedule."
---

# interview-prep

## When to use
- User has interviews today and wants a brief on each candidate.
- User asks what earlier rounds covered, or missed, for a candidate.
- Scheduled weekday run before the user's first interview.
- User wants targeted questions for an upcoming interview.

## Steps
1. Check connections first. For each connector below, confirm it is signed in and that you can use the tools this skill needs there. Access can be granted per tool, so check the tools, not just the connector. Sort each one:
   - Needs sign-in: tell the user how to connect it.
   - Needs access: name the tools that are missing and how to get them.
   - Ready: carry on.
   How to check:
   - On Agent Handler: run the connector's validate_credential tool; a reauth_required error names the authenticate tool to give the user. Then run search_tools with connector_slugs set to the connector and an intent naming what this skill does there. Tools listed only under `requestable_tools` need access: offer to request exactly those with request_tool_access, and send the request only on the user's yes.
   - Elsewhere: use your setup's connection status if it has one; otherwise make this skill's first read call on each connector and sort by the error it returns.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: one ATS (greenhouse, ashby, or lever); google_calendar. Optional: gmail. Stop if no ATS or no calendar is ready. Without gmail, show the briefs in chat.
2. Find today's interviews: find the list-events tool on the google_calendar connector for today in the user's time zone. An interview is an event the ATS created, or one with a candidate as attendee and an interview title. If the user named a candidate, take only that interview.
3. For each interview (cap 6 per run), find the candidate on the ATS connector (greenhouse, ashby, or lever) by email or name. Pull role, current stage, application, resume, the interview plan for this round, and the scorecards from earlier rounds. Use only what the connector returns for this user; the ATS's own permissions decide which feedback they can see.
4. Find the gaps: attributes or focus areas in the interview plan that no earlier round rated, rated as mixed, or flagged as unclear. Note what earlier rounds already covered well so the user can skip it.
5. Write 3 to 5 questions per candidate, each aimed at a named gap and tied to the role's requirements.
6. For a first-round candidate with no earlier feedback, say so and write questions from the role's requirements and the resume.
7. Email the briefs to the user only: find the send-message tool on the gmail connector, addressed to the user's own email, before the first interview. In an interactive run, show the briefs in chat and send on request.

## Output
- One brief per candidate, ordered by interview time: name, role, stage, interview time, what earlier rounds covered, the gaps.
- Questions under each gap, labeled with the gap they target.
- One line naming any candidate the ATS could not match.

## Anti-patterns
- Do not include anything about protected characteristics (age, family status, health, religion, ethnicity, and similar), even if it appears in notes.
- Do not send the brief to anyone but the interviewer, and do not post it to chat channels.
- Do not quote earlier interviewers' scorecards verbatim; summarize what was covered and what is open.
- Do not work around the ATS's permissions to reach feedback the user cannot see.
- Do not invent background the resume and application do not contain.
