---
name: vendor-bill-review
description: "Weekly review of open vendor bills: what is due, what is overdue, and what looks like a duplicate or is missing details. Use when the user says 'which bills are due this week', 'check for duplicate bills', or asks for a pre-payment-run review."
---

# vendor-bill-review

## When to use
- Before a payment run, to catch duplicates and bills missing details.
- User asks which vendor bills are due this week or overdue.
- Scheduled weekly summary for accounts payable.
- User asks whether a specific bill looks like a duplicate.

## Steps
1. Check connections first. For each connector below, run its validate_credential tool, and run Agent Handler search_tools with connector_slugs set to it and an intent naming what this skill does there (for example "search open deals", "create a note"). Access is granted per tool, and a connector's tools can show up in search before anyone has signed in, so sort by both results:
   - Needs sign-in: validate_credential fails (for example reauth_required). Give the user the authenticate tool the error names, such as authenticate_salesforce.
   - Needs access: a tool this skill needs comes back only under `requestable_tools`. Offer to request exactly those tools with request_tool_access, and send the request only on the user's yes.
   - Ready: validate_credential succeeds and the tools this skill needs come back under `tools`.
   Open the reply with one line per connector that isn't ready and what that rules out, then continue with the ready ones.
   Required: netsuite or quickbooks_online. Optional: slack, gmail. Stop if no accounting system is ready. Without slack or gmail, show the summary in chat.
2. Confirm the accounting system (netsuite or quickbooks_online) and, on the first run, whether the company requires a PO on bills. Reuse the answer for the session.
3. Pull open vendor bills: find the list-bills or search-bills tool on the accounting connector. Fetch vendor, bill ID, invoice number, bill date, due date, amount, currency, memo, and PO reference. Cap at 500 bills and say how many were covered if there are more.
4. Sort into due in the next 7 days and overdue (due date before today, still open).
5. Flag likely duplicates: same vendor and amount, with the same invoice number or bill dates within 3 days of each other. Bills with the same vendor and amount about a month apart are recurring (rent, subscriptions); list them separately as "recurring, check if expected" with the reason, so Finance can dismiss them quickly.
6. Flag missing details: no due date, no memo, or no PO where the company requires one.
7. Present the summary. For delivery, confirm the destination once (a Slack channel via the slack post-message tool, or an email via gmail) and send after the user approves the text. On a scheduled run, use the destination confirmed at setup.

## Output
- Four sections: Due this week, Overdue, Possible duplicates, Missing details.
- Each flagged bill with vendor, bill ID, amount, dates, and why it was flagged; duplicates show the matching bill IDs side by side.
- Totals per section in each currency.
- A "recurring, check if expected" list kept apart from the duplicates.

## Anti-patterns
- Do not create, approve, pay, edit, or void any bill; this skill is read-only.
- Do not call a bill a duplicate without the matching bill ID next to it.
- Do not sum amounts across currencies.
- Do not post the summary anywhere the user has not confirmed.
