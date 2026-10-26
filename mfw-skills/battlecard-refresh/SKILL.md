---
name: battlecard-refresh
description: "Update a competitive battlecard from the period's win/loss records, call notes, and deal reviews, with every claim dated and sourced. Use when the user says 'update the battlecard', 'refresh our positioning against a competitor', or asks what was learned about a competitor last quarter."
---

# battlecard-refresh

## When to use
- A battlecard is stale and new deal evidence has accumulated.
- A competitor shipped something and the positioning needs a pass.
- User asks what actually happened in deals against a named competitor.
- A rep reports a competitor claim and the user wants it checked before it spreads.

## Steps
1. Check connections first. For each connector below, run its validate_credential tool, and run Agent Handler search_tools with connector_slugs set to it and an intent naming what this skill does there (for example "search open deals", "create a note"). Access is granted per tool, and a connector's tools can show up in search before anyone has signed in, so sort by both results:
   - Needs sign-in: validate_credential fails (for example reauth_required). Give the user the authenticate tool the error names, such as authenticate_salesforce.
   - Needs access: a tool this skill needs comes back only under `requestable_tools`. Offer to request exactly those tools with request_tool_access, and send the request only on the user's yes.
   - Ready: validate_credential succeeds and the tools this skill needs come back under `tools`.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: one doc store (notion, confluence, sharepoint, or google_drive); hubspot or salesforce; gong or fireflies. Optional: none. Stop if no doc store is ready, or if neither a CRM nor a call source is ready.
2. Pin the competitor and the period. Default to the last full quarter and restate the window before searching; a refresh over the wrong period is wasted work.
3. Locate the current card. Find the search tool on the notion, confluence, sharepoint, or google_drive connector via Agent Handler tool search, whichever hosts it. Confirm the card is canonical, not a copy or an export. If two candidates look canonical, prefer the most recently modified and report the ambiguity.
4. Pull deal outcomes: find the search-opportunities or list-deals tool on the salesforce or hubspot connector and collect closed-won and closed-lost records naming the competitor in the period, with their stated loss reasons.
5. Pull call evidence: find the transcript-search or list-calls tool on the gong or fireflies connector. Search the competitor name, its product names, and the phrases reps actually use rather than the official ones.
6. Sort every finding into Observed (seen in a bake-off, demo, or migration) or Reported (a prospect or customer said it, attributed to who and when). Never merge the two categories.
7. Update each section of the existing card. Preserve approved positioning language unless evidence contradicts it, and date every claim; a competitive claim without a date is a liability because products change.
8. Save as a new dated version alongside the current card. Present the change log and, only after confirmation, find the create-page or create-file tool on the same doc store connector and write it; creating the version is a write. Never overwrite the published card reps pull up mid-call, and do not post the refresh to a field channel yourself. Both belong to the card's owner.

## Output
- Link to the new dated version, plus a change log table: section, before, after, evidence.
- New evidence this period, each line marked Observed or Reported with source and date.
- Needs verification: claims resting on a single or weak source, and who could confirm each.
- Claims removed, with why each was dropped.
- Where we lose consistently, stated plainly. A card listing only our strengths is unusable in a live deal.

## Anti-patterns
- Carrying forward last year's claims because nobody has disproven them.
- Turning one lost deal into a pattern.
- Sourcing a competitor capability claim from the competitor's own website.
- Quoting competitor pricing as fact from a single deal.
- Writing claims about the competitor's roadmap.
- Writing the card for marketing rather than for a rep on a live call.
