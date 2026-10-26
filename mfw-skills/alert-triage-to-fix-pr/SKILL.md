---
name: alert-triage-to-fix-pr
description: "Triage a Sentry error alert, size its impact, reply in the alert's Slack thread, and open a draft fix PR for a human to review. Use when the user says 'triage this alert', 'draft a fix for this Sentry issue', or asks how many users an error is affecting."
---

# alert-triage-to-fix-pr

## When to use
- A Sentry alert posted in Slack and the on-call engineer wants it triaged.
- User shares a Sentry issue link and wants a fix drafted.
- User asks how bad an error is: how many users, since when, which release.
- Run inside a coding agent with a local checkout of the affected repo (Claude Code, Codex); the fix is written there.

## Steps
1. Check connections first. For each connector below, confirm it is signed in and that you can use the tools this skill needs there. Access can be granted per tool, so check the tools, not just the connector. Sort each one:
   - Needs sign-in: tell the user how to connect it.
   - Needs access: name the tools that are missing and how to get them.
   - Ready: carry on.
   How to check:
   - On Agent Handler: run the connector's validate_credential tool; a reauth_required error names the authenticate tool to give the user. Then run search_tools with connector_slugs set to the connector and an intent naming what this skill does there. Tools listed only under `requestable_tools` need access: offer to request exactly those with request_tool_access, and send the request only on the user's yes.
   - Elsewhere: use your setup's connection status if it has one; otherwise make this skill's first read call on each connector and sort by the error it returns.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: sentry; slack; github. Optional: none. Stop if sentry is not ready. Without slack, put the impact summary in chat; without github, search open PRs with local `gh`.
2. Get the issue. From the alert message or link, find the get-issue tool on the sentry connector and pull: title, culprit, stack trace (in-app frames), event count, users affected, first seen, last seen, release, and environment.
3. Check for existing work. Search the repo's open PRs (github connector or local `gh`) for the Sentry issue ID or short ID. If a PR already exists, link it in the thread and stop; do not open another.
4. Write the impact summary: what breaks for the user, how many users and events, first and last seen, whether it started with a specific release, and whether it is still firing. Use counts exactly as Sentry reports them.
5. Reply in the alert's Slack thread with the summary, using the slack connector's post-message tool with the alert's thread timestamp. In an interactive run, show the reply first and post on confirmation.
6. Locate the code. Map the top in-app frames to files in the local checkout. If no frame maps to the repo, or the cause is outside the code (config, infra, a third-party outage), say so in the thread and stop with no fix attempted.
7. Draft the smallest fix that addresses the root cause shown in the trace. Add or update a test that reproduces the failure when the repo has a test suite, and run it.
8. Open a draft PR on a new branch: title naming the error, body with the impact summary, root cause, the change, test results, and a link to the Sentry issue. The PR stays a draft for a human to review and merge.
9. Post the PR link in the alert thread.

## Output
- Thread reply: impact summary with Sentry's numbers, plus the draft PR link or the reason no fix was attempted.
- A draft PR linked to the Sentry issue, with root cause, change, and test results in the body.
- In chat: the issue, the PR link, and anything the reviewer should look at first.

## Anti-patterns
- Do not merge, approve, or mark the PR ready; a human reviews every change.
- Do not copy user data from events into the PR or thread: no emails, IPs, request bodies, tokens, or user IDs. Describe the failing input's shape instead.
- Do not open a second PR for an issue that already has one.
- Do not guess a fix when the trace does not point into the repo; report the impact and stop.
- Do not round or estimate impact numbers; quote Sentry.
