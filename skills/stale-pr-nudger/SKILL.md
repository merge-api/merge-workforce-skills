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
1. Confirm scope: which repos (or org), and the SLA threshold. Default to 48 business hours if the user gives none, and say so.
2. List open PRs per repo: find the list-pull-requests tool on the github connector. Filter to non-draft PRs. Cap at 100 PRs per repo; if more, ask the user to narrow by label or team.
3. For each candidate, fetch requested reviewers and existing reviews (find the PR-reviews tool). A PR is stale when it has had no review activity since the SLA window began and still has pending requested reviewers.
4. Exclude PRs with failing required checks if the user wants "actionable" nudges only; ask once which behavior they want and remember it for the session.
5. Group stale PRs by pending reviewer. Draft one message per reviewer listing their waiting PRs with links and wait times.
6. Present all drafts and the delivery target (slack channel, slack DM, or microsoft_teams chat). Send only after the user confirms recipients and text. Find the post-message tool on the slack or microsoft_teams connector to deliver.
7. Report delivery results, including any reviewer you could not resolve to a chat handle.
8. Skip PRs labeled on-hold, WIP, or do-not-nudge; list them separately so they are visible but unpinged.

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
