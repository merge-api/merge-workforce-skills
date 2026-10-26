---
name: release-notes
description: "Drafts release notes from merged PRs and closed tickets between two releases. Use when the user says 'write the release notes', 'draft the changelog for v2.3', or asks what shipped since the last release."
---

# release-notes-generator

## When to use
- User asks for release notes or a changelog for an upcoming or just-cut release.
- User asks "what shipped since vX" or "what is in this release".
- User wants customer-facing wording for a batch of merged work.
- User wants an internal changelog for the team, with the Internal section kept in.

## Steps
1. Establish the range. Ask for the repo and the two endpoints (previous tag or release and the new one, or a date range). On github, use get_releases or get_latest_release to find the previous release if the user does not know it. Use the equivalent tools on gitlab where relevant.
2. Collect merged PRs in the range. On github, use get_pull_requests filtered to merged state and the window, or get_commits between the tags; cap at 100 PRs and tell the user if the range holds more.
3. Enrich with tickets. For PRs that reference issue keys, find the get-issue tool on jira or linear and pull titles and labels so notes describe user impact, not branch names.
4. Classify each change: Features, Improvements, Fixes, Breaking changes, Internal. Put anything labeled internal, chore, or test under Internal and default to excluding that section from customer-facing notes.
5. Draft the notes:
   - Lead each entry with what the user can now do, not the implementation.
   - Keep one line per change with the PR number linked.
   - Flag breaking changes at the top, with migration notes when the PR describes them.
6. Show the draft. This skill drafts only; if the user wants it published as a GitHub release or posted elsewhere, confirm the exact text and destination first.

## Output
- A markdown document: version, date, then sections in this order: Breaking changes, Features, Improvements, Fixes.
- Each entry: one sentence, present tense, ending with the PR link.
- A short "not included" note listing internal-only changes by count.

## Anti-patterns
- Do not invent user-facing impact for changes you cannot classify; put them under a "Needs description" list for the user.
- Do not include every commit; work from merged PRs and closed tickets.
- Do not publish or tag a release without explicit confirmation.
- Do not restate PR titles verbatim when they are written for developers; rewrite for the reader.
