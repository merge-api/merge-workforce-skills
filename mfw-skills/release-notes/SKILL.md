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
1. Check connections first. For each connector below, confirm it is signed in and that the tools this skill needs are available; access can be granted per tool, so a signed-in connector can still be missing one. Tell the user which connectors need sign-in or an access request and what that rules out, then continue with the ready ones.
   - On Agent Handler: validate_credential shows sign-in; a reauth_required error names the authenticate tool to give the user. search_tools with connector_slugs set to the connector and an intent naming what this skill does there shows access; tools listed only under `requestable_tools` need it. Offer request_tool_access for exactly those, and send it only on the user's yes.
   - Elsewhere: make this skill's first read call on each connector and report the error it returns.
   Required: github or gitlab. Optional: linear, jira. Stop if no code host is ready.
2. Establish the range. Ask for the repo and the two endpoints (previous tag or release and the new one, or a date range). On github, use get_releases or get_latest_release to find the previous release if the user does not know it. Use the equivalent tools on gitlab where relevant.
3. Collect merged PRs in the range. On github, use get_pull_requests filtered to merged state and the window, or get_commits between the tags; cap at 100 PRs and tell the user if the range holds more.
4. Enrich with tickets. For PRs that reference issue keys, find the get-issue tool on jira or linear and pull titles and labels so notes describe user impact, not branch names.
5. Classify each change: Features, Improvements, Fixes, Breaking changes, Internal. Put anything labeled internal, chore, or test under Internal and default to excluding that section from customer-facing notes.
6. Draft the notes:
   - Lead each entry with what the user can now do, not the implementation.
   - Keep one line per change with the PR number linked.
   - Flag breaking changes at the top, with migration notes when the PR describes them.
7. Show the draft. This skill drafts only; if the user wants it published as a GitHub release or posted elsewhere, confirm the exact text and destination first.

## Output
- A markdown document: version, date, then sections in this order: Breaking changes, Features, Improvements, Fixes.
- Each entry: one sentence, present tense, ending with the PR link.
- A short "not included" note listing internal-only changes by count.

## Anti-patterns
- Do not invent user-facing impact for changes you cannot classify; put them under a "Needs description" list for the user.
- Do not include every commit; work from merged PRs and closed tickets.
- Do not publish or tag a release without explicit confirmation.
- Do not restate PR titles verbatim when they are written for developers; rewrite for the reader.
