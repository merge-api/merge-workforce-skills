---
name: crm-hygiene-audit
description: "Audit open CRM opportunities for missing required fields, stale deals, and contradictions, then nudge each owner in Slack once the user approves. Use when the user says 'run a CRM hygiene audit', 'which deals have close dates in the past', or asks which owners need to clean up their pipeline."
---

# crm-hygiene-audit

## When to use
- User wants a hygiene sweep of open opportunities before a forecast or pipeline review.
- User asks which deals are missing required fields, or have close dates in the past.
- User wants owners reminded to fix their records, once or as a weekly sweep.
- User asks which reps carry the most hygiene issues.

## Steps
1. Confirm the CRM (salesforce or hubspot) and the scope: whole pipeline, a team, an owner, or a close-date window. Default to all open opportunities and say so.
2. Get the rules. Ask once which fields are required at each stage, using the CRM's own field names; offer the stage list from the CRM so the user only fills in fields. Reuse the answer for the rest of the session. Use only the fields the user named.
3. Pull open opportunities: find the search-opportunities tool (salesforce) or search_deals (hubspot) and fetch stage, amount, close date, owner, last activity date, and the required fields. Cap at 200 records; if the scope holds more, say how many were covered and offer the next batch.
4. Flag three kinds of issue per record:
   - Missing: a field required at the record's current stage is empty.
   - Stale: close date in the past while still open, or no activity in 30 days (or the user's threshold).
   - Contradiction: fields that disagree, such as a late stage with no amount, or a next-step date before today.
   Record how long each issue has been true where the CRM shows it (close date passed on, last activity on).
5. Group issues by owner. Resolve each owner to a Slack user with the slack connector's lookup-user-by-email tool. Owners with no match go on a separate list for the user.
6. Draft one Slack message per owner listing every record they need to fix, with record links and the specific issue for each.
7. Present the issues table, the drafts, and the delivery target (DM or a named channel). Post only after the user confirms recipients and text, using the slack post-message tool.
8. Report what was posted and to whom.

## Output
- Issues table sorted by owner: record (linked), owner, issue type, field or detail, how long it has been wrong.
- Draft nudges, one per owner, shown before anything is posted.
- After posting: one confirmation line per owner.
- Summary line: records scanned, records with issues, owners nudged, owners not matched in Slack.

## Anti-patterns
- Do not edit CRM records; this version reports and nudges, and owners make the fixes.
- Do not assume field names or stage rules; use only what the user confirmed.
- Do not send one message per record; batch per owner.
- Do not guess Slack handles from names; resolve by email or list the owner as unmatched.
- Do not post anything before the user approves the exact messages.
