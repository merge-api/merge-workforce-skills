---
name: stale-pr-nudger
description: "Find open PRs waiting on review past an SLA and ping the responsible reviewers in chat. Use when the user says 'nudge stale PRs', 'what PRs are waiting on review', or asks to chase reviewers."
---

# stale-pr-nudger

## When to use
- User asks which PRs have been waiting on review too long.
- User wants reviewers reminded about pending PRs, once or as a recurring sweep.
- User asks for a review-queue health snapshot for a repo or team.
- User wants to know which reviewers carry the longest review backlogs.

## Steps
1. Check connections first. For each connector below, run its validate_credential tool, and run Agent Handler search_tools with connector_slugs set to it and an intent naming what this skill does there (for example "search open deals", "create a note"). Access is granted per tool, and a connector's tools can show up in search before anyone has signed in, so sort by both results:
   - Needs sign-in: validate_credential fails (for example reauth_required). Give the user the authenticate tool the error names, such as authenticate_salesforce.
   - Needs access: a tool this skill needs comes back only under `requestable_tools`. Offer to request exactly those tools with request_tool_access, and send the request only on the user's yes.
   - Ready: validate_credential succeeds and the tools this skill needs come back under `tools`.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: github; slack or microsoft_teams. Optional: none. Stop if github is not ready. Without a chat connector, show the table and drafts but send nothing.
2. Confirm scope: which repos (or org), and the SLA threshold. Default to 48 business hours if the user gives none, and say so.
3. List open PRs per repo: find the list-pull-requests tool on the github connector. Filter to non-draft PRs. Cap at 100 PRs per repo; if more, ask the user to narrow by label or team.
4. For each candidate, fetch requested reviewers and existing reviews (find the PR-reviews tool). A PR is stale when it has had no review activity since the SLA window began and still has pending requested reviewers.
5. Exclude PRs with failing required checks if the user wants "actionable" nudges only; ask once which behavior they want and remember it for the session.
6. Group stale PRs by pending reviewer. Draft one message per reviewer listing their waiting PRs with links and wait times.
7. Present all drafts and the delivery target (slack channel, slack DM, or microsoft_teams chat). Send only after the user confirms recipients and text. Find the post-message tool on the slack or microsoft_teams connector to deliver.
8. Report delivery results, including any reviewer you could not resolve to a chat handle.
9. Skip PRs labeled on-hold, WIP, or do-not-nudge; list them separately so they are visible but unpinged.

## Output
- A table of stale PRs: repo, PR number and title, author, pending reviewers, days waiting, check status. Sorted by longest wait first.
- Draft nudge messages grouped per reviewer, shown before sending.
- After sending: per-message confirmation with channel or recipient.
- Summary line: total open PRs scanned, stale count, and the single oldest wait.
- On-hold and do-not-nudge PRs listed separately, unpinged.

## Anti-patterns
- Never send nudges without explicit confirmation of recipients and message text.
- Do not map GitHub usernames to chat handles by guessing; resolve via the chat connector's user lookup or ask the user.
- Do not nudge the same reviewer twice in one run with separate messages; batch per person.
- Do not scan every repo in a large org by default; require an explicit scope.
