---
name: at-risk-deal-scan
description: "Cross-references call sentiment, support issues, and engagement to flag at-risk deals. Use when the user says 'which deals are at risk', 'health check on my open deals', or asks why a specific deal feels shaky."
---

# deal-risk-signals

## When to use
- User wants an at-risk sweep across open deals for a team, owner, or quarter.
- User names one deal and wants every warning sign gathered.
- Before a forecast call, to separate real pipeline from hope.
- User asks whether support problems are quietly undermining an active deal.

## Steps
1. Check connections first. For each connector below, run its validate_credential tool, and run Agent Handler search_tools with connector_slugs set to it and an intent naming what this skill does there (for example "search open deals", "create a note"). Access is granted per tool, and a connector's tools can show up in search before anyone has signed in, so sort by both results:
   - Needs sign-in: validate_credential fails (for example reauth_required). Give the user the authenticate tool the error names, such as authenticate_salesforce.
   - Needs access: a tool this skill needs comes back only under `requestable_tools`. Offer to request exactly those tools with request_tool_access, and send the request only on the user's yes.
   - Ready: validate_credential succeeds and the tools this skill needs come back under `tools`.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: hubspot or salesforce; gong. Optional: pylon. Stop if neither a CRM nor gong is ready. Without a CRM, say the deal list is limited to deals that appear on gong calls.
2. Scope the deal set. On the CRM in use, find the deals search tool (search_deals on hubspot, search_opportunities on salesforce) and pull open deals with stage, amount, close date, owner, and associated contacts and company. Cap the sweep at 50 deals; for one named deal, go deep instead.
3. Engagement signals from the CRM: last activity date, unanswered emails, meetings canceled or not rebooked, single-threaded deals (only one contact associated).
4. Call signals. On gong, use search_calls_extensive filtered by the account for calls in the last 45 days; from get_call briefs note competitor mentions, pricing pushback, missing decision makers, and shrinking call frequency. Pull a transcript only for a deal the user is drilling into.
5. Support signals. On pylon, use search_accounts to match the company, then search_issues for open or recently escalated issues; a stack of unresolved tickets during a sales cycle is a strong risk marker.
6. Score each deal:
   - Record what, where, and when for every signal found.
   - Rate risk high, medium, or low from the count and severity of concrete signals, never from vibes.
   - Deals with no data are "unknown", not "low".
7. Present the report. Read-only by default; if the user wants follow-up tasks created for owners, confirm the exact tasks first, then use the CRM's create-task tool.

## Output
- Ranked list, highest risk first: deal, amount, close date, owner, risk level.
- Under each deal, the evidence: one line per signal with source and date.
- Suggested next action per high-risk deal, tied to the evidence.
- Unknown-risk deals listed separately with what data was missing.

## Anti-patterns
- Do not label a deal risky without at least one citable signal.
- Do not pull transcripts for every deal in a sweep; briefs and metadata first.
- Do not contact customers or reps; this skill reports to the user.
- Do not write tasks or notes to the CRM without confirmation.
