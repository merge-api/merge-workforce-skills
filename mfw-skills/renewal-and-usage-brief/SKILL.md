---
name: renewal-and-usage-brief
description: "Put an account's contract history next to its actual usage and call it expand, hold, or at risk, with the numbers behind it. Use when the user says 'give me a renewal brief for X', 'is X using what they pay for', or asks how to approach an upcoming renewal."
---

# renewal-and-usage-brief

## When to use
- A renewal is coming up and the account owner wants a brief.
- User asks whether a customer is using what they pay for.
- User wants to know if an account is an expansion or a retention risk.
- User wants a sweep of renewals in the next quarter, one brief each.

## Steps
1. Check connections first. For each connector below, run its validate_credential tool, and run Agent Handler search_tools with connector_slugs set to it and an intent naming what this skill does there (for example "search open deals", "create a note"). Access is granted per tool, and a connector's tools can show up in search before anyone has signed in, so sort by both results:
   - Needs sign-in: validate_credential fails (for example reauth_required). Give the user the authenticate tool the error names, such as authenticate_salesforce.
   - Needs access: a tool this skill needs comes back only under `requestable_tools`. Offer to request exactly those tools with request_tool_access, and send the request only on the user's yes.
   - Ready: validate_credential succeeds and the tools this skill needs come back under `tools`.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: hubspot or salesforce; google_drive or notion; the usage source. Optional: pylon. Stop if neither a CRM nor a contract store is ready. If the usage source is not ready, give the contract timeline and say usage is missing.
2. Find the account. On the CRM (salesforce or hubspot), find the search-accounts tool and match the account the user named; confirm if more than one matches. Pull renewal date, current products, contracted quantities, ARR, and owner, plus open renewal or expansion opportunities.
3. Find the contracts. Find the search tool on the google_drive or notion connector and look for order forms, MSAs, and amendments naming the account. Use executed versions only; skip drafts and redlines. Read each for start and end dates, products, quantities, unit prices, and total.
4. Build the contract timeline from oldest to newest, noting every change in products, quantity, or price.
5. Get usage. Ask which source holds usage if it is not already known for this org (CRM usage fields, a warehouse, or a product analytics tool), then pull usage per product for the last 6 months, with the date of each figure.
6. Compare usage against entitlement per product: percent used, the 6-month trend, and any overage.
7. If pylon is connected, find the search-accounts and search-issues tools and note open or recently escalated issues for the account.
8. Recommend one call, using these defaults unless the user gives their own thresholds:
   - Expand: any product above 90% of entitlement, or in overage.
   - At risk: products below 50% of entitlement, usage falling over the period, or open escalations.
   - Hold: everything else.
   State which rule fired and the numbers behind it.

## Output
- Header: account, owner, renewal date, current ARR.
- Contract timeline: date, document (linked), change.
- Usage table per product: entitled, used, percent, trend, source and date.
- Support note, if pylon was checked.
- Recommendation (expand, hold, or at risk) with the rule that fired and two or three talking points for the renewal conversation.

## Anti-patterns
- Do not estimate usage for a product with no data; say the data is missing and leave the call for that product open.
- Do not read contract terms from the CRM when an executed order form exists; the order form wins, and differences get flagged.
- Do not write to the CRM or contact the customer; this skill is read-only.
- Do not make a recommendation the numbers shown do not support.
