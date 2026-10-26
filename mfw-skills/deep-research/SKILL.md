---
name: deep-research
description: "Run multi-source research on a question and produce a cited report. Use when the user says 'do deep research on X', 'find everything credible about Y', or asks a question needing web, literature, and trial-registry sources."
---

# deep-research

## When to use
- The question needs evidence gathered across multiple independent sources.
- User wants a written report with citations, not a quick answer.
- The topic touches scientific or medical literature where primary sources matter.
- Sources disagree and the user wants the disagreement mapped, not resolved by fiat.

## Steps
1. Check connections first. For each connector below, run its validate_credential tool, and run Agent Handler search_tools with connector_slugs set to it and an intent naming what this skill does there (for example "search open deals", "create a note"). Access is granted per tool, and a connector's tools can show up in search before anyone has signed in, so sort by both results:
   - Needs sign-in: validate_credential fails (for example reauth_required). Give the user the authenticate tool the error names, such as authenticate_salesforce.
   - Needs access: a tool this skill needs comes back only under `requestable_tools`. Offer to request exactly those tools with request_tool_access, and send the request only on the user's yes.
   - Ready: validate_credential succeeds and the tools this skill needs come back under `tools`.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: exa; firecrawl. Optional: pubmed, biorxiv, clinicaltrials, wikipedia. Stop if exa is not ready. Without firecrawl, work from search snippets and say full text was not read.
2. Decompose the question into 3 to 6 sub-questions and show the plan. Ask the user to trim scope if the question is broad enough to need more.
3. Round one, breadth: find the search tool on the exa connector via Agent Handler tool search for general and technical web sources, and the search tools on pubmed, biorxiv, and clinicaltrials when the topic is biomedical. Use wikipedia for background framing only, never as a terminal citation. Cap at 10 results per sub-question.
4. Select sources by credibility:
   - Primary literature and registries over press coverage.
   - Recent over stale, independent over vendor-authored.
   Note publication dates on everything kept.
5. Round two, depth: for the strongest 3 to 5 sources per sub-question, find the scrape or get-contents tool on the firecrawl connector and pull full text. Extract claims with exact quotes and locators.
6. Iterate at most twice more on gaps and contradictions surfaced by round two. Stop when new searches return already-seen sources; that is saturation, not failure.
7. Write the report: findings per sub-question, an evidence-quality note per finding (study type, sample size, preprint vs peer-reviewed), disagreements between sources stated rather than smoothed over, and a numbered citation list with URLs and access dates.

## Output
- Executive summary: 3 to 5 sentences answering the top-level question with confidence caveats.
- Findings by sub-question, every claim carrying a citation number.
- Contradictions and open questions section.
- Numbered source list: title, venue, date, URL.

## Anti-patterns
- No uncited claims; anything from model memory is labeled as background, not evidence.
- Do not treat preprints (biorxiv) or trial registrations as settled results; label their status.
- Do not expose or compile personal health information about identifiable individuals; clinical sources are used at the study level only, and the report never offers medical advice.
- Do not keep crawling past saturation to look thorough; depth over volume.
